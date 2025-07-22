const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Bus = require('../models/Bus');
const { auth, adminAuth } = require('../middleware/auth');


router.post('/', [
  auth,
  [
    check('busId', 'Bus ID is required').not().isEmpty(),
    check('passengers', 'Passengers are required').isArray({ min: 1 }),
    check('paymentMethod', 'Payment method is required').not().isEmpty(),
    check('contactNumber', 'Contact number is required').not().isEmpty(),
    check('email', 'Email is required').isEmail()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { busId, passengers, paymentMethod, paymentStatus, contactNumber, email } = req.body;

    // Check if bus exists and has enough seats
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    if (bus.availableSeats < passengers.length) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    // Calculate total amount
    const totalAmount = bus.fare * passengers.length;

    // Determine payment status based on payment method
    let finalPaymentStatus = paymentStatus || 'Pending';
    if (paymentMethod === 'pay_now') {
      finalPaymentStatus = 'Completed';
    } else if (paymentMethod === 'pay_on_arrival') {
      finalPaymentStatus = 'Pending';
    }

    // Create booking
    const newBooking = new Booking({
      user: req.user.id,
      bus: busId,
      passengers,
      totalAmount,
      paymentMethod,
      paymentStatus: finalPaymentStatus,
      contactNumber,
      email,
      travelDate: bus.date,
      bookingStatus: 'Confirmed'
    });

    const booking = await newBooking.save();

    // Update bus available seats
    bus.availableSeats -= passengers.length;
    await bus.save();

    // Populate bus details
    await booking.populate('bus', 'busNumber busName operator from to departureTime arrivalTime');

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('bus', 'busNumber busName operator from to departureTime arrivalTime date')
      .sort({ bookingDate: -1 });
    
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// api for getting booking id
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('bus', 'busNumber busName operator from to departureTime arrivalTime date')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking or is admin
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(500).send('Server Error');
  }
});

// api to cancel booking
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking or is admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (booking.bookingStatus === 'Cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    // Update booking status
    booking.bookingStatus = 'Cancelled';
    booking.paymentStatus = 'Cancelled';
    await booking.save();

    // Update bus available seats
    const bus = await Bus.findById(booking.bus);
    if (bus) {
      bus.availableSeats += booking.passengers.length;
      await bus.save();
    }

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(500).send('Server Error');
  }
});

// api to for admin for getting all booking, all admins, and users
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('bus', 'busNumber busName operator from to')
      .populate('user', 'name email phone')
      .sort({ bookingDate: -1 });
    
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// api to cjheck payment status and bookin status
router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const { bookingStatus, paymentStatus } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (bookingStatus) booking.bookingStatus = bookingStatus;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    await booking.save();
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router; 
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Bus = require('../models/Bus');
const { auth, adminAuth } = require('../middleware/auth');

// api for searching buses
router.get('/search', async (req, res) => {
  try {
    const { from, to, date } = req.query;
    
    if (!from || !to || !date) {
      return res.status(400).json({ message: 'Please provide from, to, and date parameters' });
    }

    const searchDate = new Date(date);
    searchDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(searchDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const buses = await Bus.find({
      from: { $regex: from, $options: 'i' },
      to: { $regex: to, $options: 'i' },
      date: {
        $gte: searchDate,
        $lt: nextDate
      },
      isActive: true,
      availableSeats: { $gt: 0 }
    }).sort({ departureTime: 1 });

    res.json(buses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// api to get all buses
router.get('/', async (req, res) => {
  try {
    const buses = await Bus.find({ isActive: true }).sort({ date: 1 });
    res.json(buses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// to get bus by id
router.get('/:id', async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    
    res.json(bus);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Bus not found' });
    }
    res.status(500).send('Server Error');
  }
});

// api for adding bus
router.post('/', [
  adminAuth,
  [
    check('busNumber', 'Bus number is required').not().isEmpty(),
    check('busName', 'Bus name is required').not().isEmpty(),
    check('operator', 'Operator is required').not().isEmpty(),
    check('from', 'From location is required').not().isEmpty(),
    check('to', 'To location is required').not().isEmpty(),
    check('departureTime', 'Departure time is required').not().isEmpty(),
    check('arrivalTime', 'Arrival time is required').not().isEmpty(),
    check('date', 'Date is required').not().isEmpty(),
    check('fare', 'Fare is required').isNumeric()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      busNumber,
      busName,
      operator,
      from,
      to,
      departureTime,
      arrivalTime,
      date,
      totalSeats,
      fare,
      busType,
      amenities
    } = req.body;

    const newBus = new Bus({
      busNumber,
      busName,
      operator,
      from,
      to,
      departureTime,
      arrivalTime,
      date,
      totalSeats: totalSeats || 40,
      availableSeats: totalSeats || 40,
      fare,
      busType,
      amenities
    });

    const bus = await newBus.save();
    res.json(bus);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// api for updating bus
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    const updatedBus = await Bus.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedBus);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Bus not found' });
    }
    res.status(500).send('Server Error');
  }
});

// api for deleting bus
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    await bus.remove();
    res.json({ message: 'Bus removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Bus not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router; 
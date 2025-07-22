import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper
} from '@mui/material';
import {
  DirectionsBus,
  Schedule,
  LocationOn,
  AttachMoney,
  Person,
  Payment,
  CreditCard,
  MoneyOff
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';

const BookingForm = () => {
  const { busId } = useParams();
  const navigate = useNavigate();
  
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [bookingData, setBookingData] = useState({
    numberOfPassengers: 1,
    passengers: [{
      name: '',
      age: '',
      gender: '',
      seatNumber: ''
    }],
    contactNumber: '',
    email: '',
    paymentMethod: 'pay_on_arrival', // Default to pay on arrival
    paymentStatus: 'Pending'
  });

  useEffect(() => {
    const fetchBus = async () => {
      try {
        const response = await axios.get(`/api/buses/${busId}`);
        setBus(response.data);
      } catch (err) {
        setError('Failed to load bus details');
      } finally {
        setLoading(false);
      }
    };

    fetchBus();
  }, [busId]);

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...bookingData.passengers];
    updatedPassengers[index][field] = value;
    setBookingData({
      ...bookingData,
      passengers: updatedPassengers
    });
  };

  const handleNumberOfPassengersChange = (value) => {
    const numPassengers = parseInt(value);
    const passengers = [];
    
    for (let i = 0; i < numPassengers; i++) {
      passengers.push({
        name: '',
        age: '',
        gender: '',
        seatNumber: ''
      });
    }
    
    setBookingData({
      ...bookingData,
      numberOfPassengers: numPassengers,
      passengers
    });
  };

  const handlePaymentMethodChange = (method) => {
    setBookingData({
      ...bookingData,
      paymentMethod: method,
      paymentStatus: method === 'pay_now' ? 'Completed' : 'Pending'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const bookingPayload = {
        busId,
        passengers: bookingData.passengers,
        paymentMethod: bookingData.paymentMethod,
        paymentStatus: bookingData.paymentStatus,
        contactNumber: bookingData.contactNumber,
        email: bookingData.email
      };

      const response = await axios.post('/api/bookings', bookingPayload);
      
      const successMessage = bookingData.paymentMethod === 'pay_now' 
        ? 'Booking successful! Payment completed. Your booking ID is: ' + response.data.bookingId
        : 'Booking successful! Please pay on arrival. Your booking ID is: ' + response.data.bookingId;
      
      navigate(`/my-bookings`, { 
        state: { message: successMessage }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!bus) {
    return (
      <Container>
        <Alert severity="error">Bus not found</Alert>
      </Container>
    );
  }

  const totalAmount = bus.fare * bookingData.numberOfPassengers;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Book Your Ticket
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Bus Details */}
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Bus Details
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <DirectionsBus sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">
                    {bus.busName}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {bus.operator}
                </Typography>
                <Chip label={bus.busType} size="small" color="primary" sx={{ mt: 1 }} />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Route
                </Typography>
                <Typography variant="body1">
                  {bus.from} → {bus.to}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Date & Time
                </Typography>
                <Typography variant="body1">
                  {format(new Date(bus.date), 'MMM dd, yyyy')}
                </Typography>
                <Typography variant="body1">
                  {bus.departureTime} - {bus.arrivalTime}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Available Seats
                </Typography>
                <Typography variant="h6" color="primary">
                  {bus.availableSeats}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Fare per seat
                </Typography>
                <Typography variant="h5" color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
                  <AttachMoney sx={{ fontSize: 20 }} />
                  {bus.fare}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Booking Form */}
        <Grid item xs={12} md={8}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Passenger Details
              </Typography>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Number of Passengers</InputLabel>
                      <Select
                        value={bookingData.numberOfPassengers}
                        label="Number of Passengers"
                        onChange={(e) => handleNumberOfPassengersChange(e.target.value)}
                      >
                        {[...Array(Math.min(bus.availableSeats, 6))].map((_, i) => (
                          <MenuItem key={i + 1} value={i + 1}>
                            {i + 1}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Contact Number"
                      value={bookingData.contactNumber}
                      onChange={(e) => setBookingData({ ...bookingData, contactNumber: e.target.value })}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={bookingData.email}
                      onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                      required
                    />
                  </Grid>

                  {/* Payment Method Selection */}
                  <Grid item xs={12}>
                    <Paper elevation={1} sx={{ p: 3, bgcolor: 'grey.50' }}>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <Payment sx={{ mr: 1 }} />
                        Payment Method
                      </Typography>
                      
                      <RadioGroup
                        value={bookingData.paymentMethod}
                        onChange={(e) => handlePaymentMethodChange(e.target.value)}
                      >
                        <FormControlLabel
                          value="pay_on_arrival"
                          control={<Radio />}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <MoneyOff sx={{ mr: 1, color: 'warning.main' }} />
                              <Box>
                                <Typography variant="body1">Pay on Arrival</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Pay the fare when you board the bus
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                        <FormControlLabel
                          value="pay_now"
                          control={<Radio />}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CreditCard sx={{ mr: 1, color: 'success.main' }} />
                              <Box>
                                <Typography variant="body1">Pay Now</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Pay online now (simulated payment)
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                      </RadioGroup>

                      {bookingData.paymentMethod === 'pay_now' && (
                        <Alert severity="info" sx={{ mt: 2 }}>
                          This is a simulated payment. In a real application, you would be redirected to a payment gateway.
                        </Alert>
                      )}
                    </Paper>
                  </Grid>

                  {/* Passenger Details */}
                  {bookingData.passengers.map((passenger, index) => (
                    <Grid item xs={12} key={index}>
                      <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Passenger {index + 1}
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Full Name"
                              value={passenger.name}
                              onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <TextField
                              fullWidth
                              label="Age"
                              type="number"
                              value={passenger.age}
                              onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <FormControl fullWidth>
                              <InputLabel>Gender</InputLabel>
                              <Select
                                value={passenger.gender}
                                label="Gender"
                                onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                                required
                              >
                                <MenuItem value="Male">Male</MenuItem>
                                <MenuItem value="Female">Female</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <TextField
                              fullWidth
                              label="Seat Number"
                              type="number"
                              value={passenger.seatNumber}
                              onChange={(e) => handlePassengerChange(index, 'seatNumber', e.target.value)}
                              required
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  ))}

                  {/* Total Amount */}
                  <Grid item xs={12}>
                    <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                      <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Total Amount:</span>
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                          <AttachMoney />
                          {totalAmount}
                        </span>
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Payment Status: {bookingData.paymentStatus}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      disabled={submitting}
                    >
                      {submitting ? <CircularProgress size={24} /> : 'Confirm Booking'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BookingForm; 
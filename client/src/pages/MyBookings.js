import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  DirectionsBus,
  Schedule,
  LocationOn,
  AttachMoney,
  Cancel,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';

const MyBookings = () => {
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelDialog, setCancelDialog] = useState({ open: false, bookingId: null });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/bookings');
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    try {
      await axios.put(`/api/bookings/${cancelDialog.bookingId}/cancel`);
      setCancelDialog({ open: false, bookingId: null });
      fetchBookings(); // Refresh the list
    } catch (err) {
      setError('Failed to cancel booking');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'success';
      case 'Cancelled':
        return 'error';
      case 'Completed':
        return 'info';
      default:
        return 'default';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Failed':
        return 'error';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Bookings
      </Typography>

      {location.state?.message && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {location.state.message}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {bookings.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No bookings found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start by searching for buses and making a booking
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((booking) => (
            <Grid item xs={12} key={booking._id}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Booking ID: {booking.bookingId}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Booked on: {format(new Date(booking.bookingDate), 'MMM dd, yyyy HH:mm')}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Chip
                        label={booking.bookingStatus}
                        color={getStatusColor(booking.bookingStatus)}
                        sx={{ mb: 1 }}
                      />
                      <Chip
                        label={booking.paymentStatus}
                        color={getPaymentStatusColor(booking.paymentStatus)}
                        size="small"
                      />
                    </Box>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <DirectionsBus sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6">
                          {booking.bus.busName}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {booking.bus.operator}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body1">
                          {booking.bus.from} → {booking.bus.to}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Schedule sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {format(new Date(booking.travelDate), 'MMM dd, yyyy')} | {booking.bus.departureTime} - {booking.bus.arrivalTime}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Passenger Details
                    </Typography>
                    {booking.passengers.map((passenger, index) => (
                      <Typography key={index} variant="body2">
                        {passenger.name} (Age: {passenger.age}, Gender: {passenger.gender}, Seat: {passenger.seatNumber})
                      </Typography>
                    ))}
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Total Amount
                      </Typography>
                      <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
                        <AttachMoney />
                        {booking.totalAmount}
                      </Typography>
                    </Box>

                    {booking.bookingStatus === 'Confirmed' && (
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Cancel />}
                        onClick={() => setCancelDialog({ open: true, bookingId: booking._id })}
                      >
                        Cancel Booking
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialog.open} onClose={() => setCancelDialog({ open: false, bookingId: null })}>
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this booking? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog({ open: false, bookingId: null })}>
            No, Keep Booking
          </Button>
          <Button onClick={handleCancelBooking} color="error" variant="contained">
            Yes, Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyBookings; 
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  ExpandMore,
  Edit,
  Visibility,
  BookOnline,
  Person,
  DirectionsBus,
  Schedule,
  LocationOn,
  AttachMoney
} from '@mui/icons-material';
import { format } from 'date-fns';
import axios from 'axios';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusData, setStatusData] = useState({
    bookingStatus: '',
    paymentStatus: ''
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/bookings/admin/all');
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };

  const handleUpdateStatus = (booking) => {
    setSelectedBooking(booking);
    setStatusData({
      bookingStatus: booking.bookingStatus,
      paymentStatus: booking.paymentStatus
    });
    setStatusDialogOpen(true);
  };

  const handleStatusSubmit = async () => {
    try {
      await axios.put(`/api/bookings/${selectedBooking._id}/status`, statusData);
      setStatusDialogOpen(false);
      fetchBookings();
    } catch (err) {
      setError('Failed to update booking status');
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
        Manage Bookings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {bookings.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Bookings
                  </Typography>
                </Box>
                <BookOnline sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    {bookings.filter(b => b.bookingStatus === 'Confirmed').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Confirmed
                  </Typography>
                </Box>
                <BookOnline sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                    {bookings.filter(b => b.bookingStatus === 'Cancelled').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cancelled
                  </Typography>
                </Box>
                <BookOnline sx={{ fontSize: 40, color: 'error.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                    ${bookings.reduce((sum, b) => sum + (b.paymentStatus === 'Completed' ? b.totalAmount : 0), 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Revenue
                  </Typography>
                </Box>
                <AttachMoney sx={{ fontSize: 40, color: 'warning.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bookings Table */}
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Booking ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Route</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Passengers</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Booking Status</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking._id}>
                <TableCell>{booking.bookingId}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">{booking.user?.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {booking.user?.email}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
                    {booking.bus?.from} → {booking.bus?.to}
                  </Box>
                </TableCell>
                <TableCell>
                  {format(new Date(booking.travelDate), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>{booking.passengers.length}</TableCell>
                <TableCell>${booking.totalAmount}</TableCell>
                <TableCell>
                  <Chip
                    label={booking.bookingStatus}
                    color={getStatusColor(booking.bookingStatus)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={booking.paymentStatus}
                    color={getPaymentStatusColor(booking.paymentStatus)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleViewBooking(booking)}
                    color="primary"
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleUpdateStatus(booking)}
                    color="secondary"
                  >
                    <Edit />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Booking Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Booking Details</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Booking Information</Typography>
                  <Typography variant="body2"><strong>Booking ID:</strong> {selectedBooking.bookingId}</Typography>
                  <Typography variant="body2"><strong>Booking Date:</strong> {format(new Date(selectedBooking.bookingDate), 'MMM dd, yyyy HH:mm')}</Typography>
                  <Typography variant="body2"><strong>Travel Date:</strong> {format(new Date(selectedBooking.travelDate), 'MMM dd, yyyy')}</Typography>
                  <Typography variant="body2"><strong>Total Amount:</strong> ${selectedBooking.totalAmount}</Typography>
                  <Typography variant="body2"><strong>Payment Method:</strong> {selectedBooking.paymentMethod}</Typography>
                  <Typography variant="body2"><strong>Contact:</strong> {selectedBooking.contactNumber}</Typography>
                  <Typography variant="body2"><strong>Email:</strong> {selectedBooking.email}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Bus Information</Typography>
                  <Typography variant="body2"><strong>Bus:</strong> {selectedBooking.bus?.busName}</Typography>
                  <Typography variant="body2"><strong>Operator:</strong> {selectedBooking.bus?.operator}</Typography>
                  <Typography variant="body2"><strong>Route:</strong> {selectedBooking.bus?.from} → {selectedBooking.bus?.to}</Typography>
                  <Typography variant="body2"><strong>Time:</strong> {selectedBooking.bus?.departureTime} - {selectedBooking.bus?.arrivalTime}</Typography>
                  <Typography variant="body2"><strong>Type:</strong> {selectedBooking.bus?.busType}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Passenger Details</Typography>
                  {selectedBooking.passengers.map((passenger, index) => (
                    <Box key={index} sx={{ mb: 1, p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                      <Typography variant="body2">
                        <strong>Passenger {index + 1}:</strong> {passenger.name} (Age: {passenger.age}, Gender: {passenger.gender}, Seat: {passenger.seatNumber})
                      </Typography>
                    </Box>
                  ))}
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
        <DialogTitle>Update Booking Status</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Booking Status</InputLabel>
                <Select
                  value={statusData.bookingStatus}
                  label="Booking Status"
                  onChange={(e) => setStatusData({ ...statusData, bookingStatus: e.target.value })}
                >
                  <MenuItem value="Confirmed">Confirmed</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Payment Status</InputLabel>
                <Select
                  value={statusData.paymentStatus}
                  label="Payment Status"
                  onChange={(e) => setStatusData({ ...statusData, paymentStatus: e.target.value })}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Failed">Failed</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleStatusSubmit} variant="contained">Update Status</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminBookings; 
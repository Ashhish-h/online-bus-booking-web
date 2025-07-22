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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  DirectionsBus,
  People,
  BookOnline,
  AttachMoney,
  TrendingUp,
  TrendingDown
} from '@mui/icons-material';
import { format } from 'date-fns';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBuses: 0,
    totalBookings: 0,
    totalRevenue: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all bookings for stats
      const bookingsResponse = await axios.get('/api/bookings/admin/all');
      const bookings = bookingsResponse.data;

      // Fetch all users
      const usersResponse = await axios.get('/api/users/admin/all');
      const users = usersResponse.data;

      // Fetch all buses
      const busesResponse = await axios.get('/api/buses');
      const buses = busesResponse.data;

      // Calculate statistics
      const totalRevenue = bookings.reduce((sum, booking) => {
        return booking.paymentStatus === 'Completed' ? sum + booking.totalAmount : sum;
      }, 0);

      const confirmedBookings = bookings.filter(booking => booking.bookingStatus === 'Confirmed').length;
      const cancelledBookings = bookings.filter(booking => booking.bookingStatus === 'Cancelled').length;

      setStats({
        totalUsers: users.length,
        totalBuses: buses.length,
        totalBookings: bookings.length,
        totalRevenue,
        confirmedBookings,
        cancelledBookings
      });

      // Get recent bookings 
      setRecentBookings(bookings.slice(0, 5));
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card elevation={2}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ color: color || 'primary.main' }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

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
        Admin Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<People sx={{ fontSize: 40 }} />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Buses"
            value={stats.totalBuses}
            icon={<DirectionsBus sx={{ fontSize: 40 }} />}
            color="secondary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings}
            icon={<BookOnline sx={{ fontSize: 40 }} />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            icon={<AttachMoney sx={{ fontSize: 40 }} />}
            color="warning.main"
          />
        </Grid>
      </Grid>

      {/* Booking Status Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Booking Status Overview
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    {stats.confirmedBookings}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Confirmed
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="error.main">
                    {stats.cancelledBookings}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cancelled
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main">
                    {stats.totalBookings - stats.confirmedBookings - stats.cancelledBookings}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" paragraph>
                  • Manage buses and routes
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  • View and update bookings
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  • Manage user accounts
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Monitor system performance
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Bookings Table */}
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Bookings
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Booking ID</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Route</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentBookings.map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell>{booking.bookingId}</TableCell>
                    <TableCell>{booking.user?.name}</TableCell>
                    <TableCell>
                      {booking.bus?.from} → {booking.bus?.to}
                    </TableCell>
                    <TableCell>
                      {format(new Date(booking.travelDate), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>${booking.totalAmount}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                          backgroundColor: 
                            booking.bookingStatus === 'Confirmed' ? 'success.light' :
                            booking.bookingStatus === 'Cancelled' ? 'error.light' : 'warning.light',
                          color: 
                            booking.bookingStatus === 'Confirmed' ? 'success.dark' :
                            booking.bookingStatus === 'Cancelled' ? 'error.dark' : 'warning.dark',
                          fontSize: '0.875rem'
                        }}
                      >
                        {booking.bookingStatus}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AdminDashboard; 
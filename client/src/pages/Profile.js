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
  Button,
  TextField,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  CalendarToday,
  Edit,
  Save,
  Cancel,
  BookOnline,
  DirectionsBus,
  LocationOn,
  Schedule,
  AttachMoney
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user, loadUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [recentBookings, setRecentBookings] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || ''
      });
    }
    fetchRecentBookings();
  }, [user]);

  const fetchRecentBookings = async () => {
    try {
      const response = await axios.get('/api/bookings');
      setRecentBookings(response.data.slice(0, 3)); // Get last 3 bookings
    } catch (err) {
      console.error('Failed to fetch recent bookings');
    }
  };

  const handleEdit = () => {
    setEditMode(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData({
      name: user.name || '',
      phone: user.phone || ''
    });
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.put('/api/users/profile', formData);
      await loadUser(); // Refresh user data
      setEditMode(false);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (!user) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Profile
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: user.role === 'admin' ? 'error.main' : 'primary.main',
                  fontSize: '3rem'
                }}
              >
                {getInitials(user.name)}
              </Avatar>
              
              <Typography variant="h5" gutterBottom>
                {user.name}
              </Typography>
              
              <Chip
                label={user.role}
                color={user.role === 'admin' ? 'error' : 'primary'}
                sx={{ mb: 2 }}
              />

              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Email />
                  </ListItemIcon>
                  <ListItemText primary={user.email} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Phone />
                  </ListItemIcon>
                  <ListItemText primary={user.phone} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday />
                  </ListItemIcon>
                  <ListItemText 
                    primary={`Joined ${format(new Date(user.createdAt), 'MMM dd, yyyy')}`}
                  />
                </ListItem>
              </List>

              <Divider sx={{ my: 2 }} />

              {!editMode ? (
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={handleEdit}
                  fullWidth
                >
                  Edit Profile
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={loading}
                    sx={{ flex: 1 }}
                  >
                    {loading ? <CircularProgress size={20} /> : 'Save'}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                    sx={{ flex: 1 }}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Edit Profile Form */}
        {editMode && (
          <Grid item xs={12} md={8}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Edit Profile Information
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={user.email}
                      disabled
                      helperText="Email cannot be changed"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Recent Bookings */}
        {!editMode && (
          <Grid item xs={12} md={8}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Recent Bookings
                  </Typography>
                  <Button
                    variant="text"
                    onClick={() => window.location.href = '/my-bookings'}
                  >
                    View All
                  </Button>
                </Box>

                {recentBookings.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <BookOnline sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No bookings yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Start by searching for buses and making your first booking
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{ mt: 2 }}
                      onClick={() => window.location.href = '/search'}
                    >
                      Search Buses
                    </Button>
                  </Box>
                ) : (
                  <List>
                    {recentBookings.map((booking) => (
                      <ListItem key={booking._id} divider>
                        <ListItemIcon>
                          <DirectionsBus color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle1">
                                {booking.bus?.from} → {booking.bus?.to}
                              </Typography>
                              <Chip
                                label={booking.bookingStatus}
                                color={
                                  booking.bookingStatus === 'Confirmed' ? 'success' :
                                  booking.bookingStatus === 'Cancelled' ? 'error' : 'warning'
                                }
                                size="small"
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <Schedule sx={{ fontSize: 16, mr: 0.5 }} />
                                <Typography variant="body2">
                                  {format(new Date(booking.travelDate), 'MMM dd, yyyy')} | {booking.bus?.departureTime}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <Person sx={{ fontSize: 16, mr: 0.5 }} />
                                <Typography variant="body2">
                                  {booking.passengers.length} passenger{booking.passengers.length > 1 ? 's' : ''}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AttachMoney sx={{ fontSize: 16, mr: 0.5 }} />
                                <Typography variant="body2">
                                  Total: ${booking.totalAmount}
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Account Statistics */}
      {!editMode && (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center' }}>
                <BookOnline sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" component="div">
                  {recentBookings.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Bookings
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center' }}>
                <DirectionsBus sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h4" component="div">
                  {recentBookings.filter(b => b.bookingStatus === 'Confirmed').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Confirmed Trips
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center' }}>
                <AttachMoney sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="h4" component="div">
                  ${recentBookings.reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Spent
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Person sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="h4" component="div">
                  {recentBookings.reduce((sum, b) => sum + b.passengers.length, 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Passengers
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Profile; 
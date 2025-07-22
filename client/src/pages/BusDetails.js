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
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Avatar
} from '@mui/material';
import {
  DirectionsBus,
  Schedule,
  LocationOn,
  AttachMoney,
  Person,
  Wifi,
  Usb,
  LocalDrink,
  Restaurant,
  Hotel,
  Bed,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const BusDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBusDetails();
  }, [id]);

  const fetchBusDetails = async () => {
    try {
      const response = await axios.get(`/api/buses/${id}`);
      setBus(response.data);
    } catch (err) {
      setError('Failed to load bus details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/booking/${id}`);
  };

  const getAmenityIcon = (amenity) => {
    switch (amenity) {
      case 'WiFi':
        return <Wifi />;
      case 'USB Charging':
        return <Usb />;
      case 'Water Bottle':
        return <LocalDrink />;
      case 'Snacks':
        return <Restaurant />;
      case 'Blanket':
        return <Hotel />;
      case 'Pillow':
        return <Bed />;
      default:
        return <CheckCircle />;
    }
  };

  const getBusTypeColor = (type) => {
    switch (type) {
      case 'AC':
        return 'primary';
      case 'Non-AC':
        return 'default';
      case 'Sleeper':
        return 'secondary';
      case 'Luxury':
        return 'warning';
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

  if (!bus) {
    return (
      <Container>
        <Alert severity="error">Bus not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Bus Details
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Main Bus Information */}
        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ mr: 2, bgcolor: 'primary.main', width: 56, height: 56 }}>
                  <DirectionsBus sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {bus.busName}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Operated by {bus.operator}
                  </Typography>
                  <Chip 
                    label={bus.busType} 
                    color={getBusTypeColor(bus.busType)}
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Route Information */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Route Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body1">
                        <strong>From:</strong> {bus.from}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn sx={{ mr: 1, color: 'secondary.main' }} />
                      <Typography variant="body1">
                        <strong>To:</strong> {bus.to}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Schedule Information */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Schedule
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Schedule sx={{ mr: 1, color: 'success.main' }} />
                      <Typography variant="body1">
                        <strong>Departure:</strong> {bus.departureTime}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Schedule sx={{ mr: 1, color: 'error.main' }} />
                      <Typography variant="body1">
                        <strong>Arrival:</strong> {bus.arrivalTime}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Date:</strong> {format(new Date(bus.date), 'EEEE, MMMM dd, yyyy')}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Amenities */}
              {bus.amenities && bus.amenities.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Amenities
                  </Typography>
                  <List dense>
                    {bus.amenities.map((amenity, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          {getAmenityIcon(amenity)}
                        </ListItemIcon>
                        <ListItemText primary={amenity} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Booking Information */}
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Booking Information
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Available Seats
                </Typography>
                <Typography variant="h4" color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Person sx={{ mr: 1 }} />
                  {bus.availableSeats}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  out of {bus.totalSeats} total seats
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Fare per seat
                </Typography>
                <Typography variant="h4" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                  <AttachMoney />
                  {bus.fare}
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleBookNow}
                disabled={bus.availableSeats === 0}
                sx={{ mb: 2 }}
              >
                {bus.availableSeats === 0 ? 'No Seats Available' : 'Book Now'}
              </Button>

              {bus.availableSeats === 0 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  This bus is fully booked. Please check other available buses.
                </Alert>
              )}

              {bus.availableSeats > 0 && bus.availableSeats <= 5 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Only {bus.availableSeats} seat{bus.availableSeats > 1 ? 's' : ''} remaining!
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Additional Information */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Important Information
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Please arrive at the bus station 30 minutes before departure time"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Valid ID proof is required for all passengers"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Cancellation is allowed up to 2 hours before departure"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Cancel color="warning" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="No refund for no-show passengers"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BusDetails; 
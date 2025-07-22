import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  DirectionsBus,
  Schedule,
  LocationOn
} from '@mui/icons-material';
import { format } from 'date-fns';
import axios from 'axios';

const AdminBuses = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [formData, setFormData] = useState({
    busNumber: '',
    busName: '',
    operator: '',
    from: '',
    to: '',
    departureTime: '',
    arrivalTime: '',
    date: '',
    totalSeats: 40,
    fare: '',
    busType: 'Non-AC',
    amenities: []
  });

  const busTypes = ['AC', 'Non-AC', 'Sleeper', 'Luxury'];
  const availableAmenities = ['WiFi', 'USB Charging', 'Water Bottle', 'Snacks', 'Blanket', 'Pillow'];

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const response = await axios.get('/api/buses');
      setBuses(response.data);
    } catch (err) {
      setError('Failed to load buses');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (bus = null) => {
    if (bus) {
      setEditingBus(bus);
      setFormData({
        busNumber: bus.busNumber,
        busName: bus.busName,
        operator: bus.operator,
        from: bus.from,
        to: bus.to,
        departureTime: bus.departureTime,
        arrivalTime: bus.arrivalTime,
        date: format(new Date(bus.date), 'yyyy-MM-dd'),
        totalSeats: bus.totalSeats,
        fare: bus.fare,
        busType: bus.busType,
        amenities: bus.amenities || []
      });
    } else {
      setEditingBus(null);
      setFormData({
        busNumber: '',
        busName: '',
        operator: '',
        from: '',
        to: '',
        departureTime: '',
        arrivalTime: '',
        date: '',
        totalSeats: 40,
        fare: '',
        busType: 'Non-AC',
        amenities: []
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingBus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBus) {
        await axios.put(`/api/buses/${editingBus._id}`, formData);
      } else {
        await axios.post('/api/buses', formData);
      }
      handleCloseDialog();
      fetchBuses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save bus');
    }
  };

  const handleDelete = async (busId) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      try {
        await axios.delete(`/api/buses/${busId}`);
        fetchBuses();
      } catch (err) {
        setError('Failed to delete bus');
      }
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Manage Buses
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add New Bus
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Buses Table */}
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Bus Number</TableCell>
              <TableCell>Bus Name</TableCell>
              <TableCell>Operator</TableCell>
              <TableCell>Route</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Seats</TableCell>
              <TableCell>Fare</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {buses.map((bus) => (
              <TableRow key={bus._id}>
                <TableCell>{bus.busNumber}</TableCell>
                <TableCell>{bus.busName}</TableCell>
                <TableCell>{bus.operator}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
                    {bus.from} → {bus.to}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">
                      {format(new Date(bus.date), 'MMM dd, yyyy')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {bus.departureTime} - {bus.arrivalTime}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {bus.availableSeats}/{bus.totalSeats}
                </TableCell>
                <TableCell>${bus.fare}</TableCell>
                <TableCell>
                  <Chip label={bus.busType} size="small" color="primary" />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(bus)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(bus._id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Bus Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingBus ? 'Edit Bus' : 'Add New Bus'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Bus Number"
                  value={formData.busNumber}
                  onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Bus Name"
                  value={formData.busName}
                  onChange={(e) => setFormData({ ...formData, busName: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Operator"
                  value={formData.operator}
                  onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Bus Type</InputLabel>
                  <Select
                    value={formData.busType}
                    label="Bus Type"
                    onChange={(e) => setFormData({ ...formData, busType: e.target.value })}
                  >
                    {busTypes.map(type => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="From"
                  value={formData.from}
                  onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="To"
                  value={formData.to}
                  onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Departure Time"
                  value={formData.departureTime}
                  onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                  required
                  placeholder="HH:MM"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Arrival Time"
                  value={formData.arrivalTime}
                  onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                  required
                  placeholder="HH:MM"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Total Seats"
                  value={formData.totalSeats}
                  onChange={(e) => setFormData({ ...formData, totalSeats: parseInt(e.target.value) })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Fare"
                  value={formData.fare}
                  onChange={(e) => setFormData({ ...formData, fare: parseFloat(e.target.value) })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Amenities
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {availableAmenities.map((amenity) => (
                    <Chip
                      key={amenity}
                      label={amenity}
                      onClick={() => handleAmenityToggle(amenity)}
                      color={formData.amenities.includes(amenity) ? 'primary' : 'default'}
                      variant={formData.amenities.includes(amenity) ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingBus ? 'Update' : 'Add'} Bus
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default AdminBuses; 
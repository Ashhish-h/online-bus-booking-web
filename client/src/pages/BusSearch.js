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
  Paper
} from '@mui/material';
import {
  DirectionsBus,
  Schedule,
  LocationOn,
  AttachMoney,
  Search
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';

const BusSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchData, setSearchData] = useState({
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
    date: searchParams.get('date') || format(new Date(), 'yyyy-MM-dd')
  });
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const params = new URLSearchParams(searchData);
      setSearchParams(params);
      
      const response = await axios.get(`/api/buses/search?${params.toString()}`);
      setBuses(response.data);
    } catch (err) {
      setError('Failed to search buses. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBusSelect = (busId) => {
    navigate(`/booking/${busId}`);
  };

  const getAmenitiesChips = (amenities) => {
    return amenities?.map((amenity, index) => (
      <Chip
        key={index}
        label={amenity}
        size="small"
        sx={{ mr: 0.5, mb: 0.5 }}
      />
    )) || [];
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Search Form */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Search Buses
        </Typography>
        
        <form onSubmit={handleSearch}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="From"
                value={searchData.from}
                onChange={(e) => setSearchData({ ...searchData, from: e.target.value })}
                required
                InputProps={{
                  startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="To"
                value={searchData.to}
                onChange={(e) => setSearchData({ ...searchData, to: e.target.value })}
                required
                InputProps={{
                  startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="date"
                label="Date"
                value={searchData.date}
                onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
                required
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <Schedule sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Search />}
              >
                {loading ? 'Searching...' : 'Search Buses'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Results */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {searched && !loading && (
        <Typography variant="h5" gutterBottom>
          {buses.length > 0 
            ? `Found ${buses.length} bus${buses.length > 1 ? 'es' : ''}`
            : 'No buses found for your search criteria'
          }
        </Typography>
      )}

      {buses.length > 0 && (
        <Grid container spacing={3}>
          {buses.map((bus) => (
            <Grid item xs={12} key={bus._id}>
              <Card elevation={2} sx={{ '&:hover': { elevation: 4 } }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <DirectionsBus sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6">
                          {bus.busName}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {bus.operator}
                      </Typography>
                      <Chip 
                        label={bus.busType} 
                        size="small" 
                        color="primary" 
                        sx={{ mt: 1 }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="text.secondary">
                        Departure
                      </Typography>
                      <Typography variant="h6">
                        {bus.departureTime}
                      </Typography>
                      <Typography variant="body2">
                        {format(new Date(bus.date), 'MMM dd, yyyy')}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="text.secondary">
                        Arrival
                      </Typography>
                      <Typography variant="h6">
                        {bus.arrivalTime}
                      </Typography>
                      <Typography variant="body2">
                        {format(new Date(bus.date), 'MMM dd, yyyy')}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={2}>
                      <Typography variant="body2" color="text.secondary">
                        Available Seats
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {bus.availableSeats}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={1}>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h5" color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
                          <AttachMoney sx={{ fontSize: 20 }} />
                          {bus.fare}
                        </Typography>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleBusSelect(bus._id)}
                          sx={{ mt: 1 }}
                        >
                          Book Now
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                  
                  {bus.amenities && bus.amenities.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Amenities:
                      </Typography>
                      {getAmenitiesChips(bus.amenities)}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default BusSearch; 
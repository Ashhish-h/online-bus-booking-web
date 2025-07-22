import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Paper,
  useTheme
} from '@mui/material';
import {
  DirectionsBus,
  Search,
  Schedule,
  Payment,
  Support,
  Security
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    date: format(new Date(), 'yyyy-MM-dd')
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchData);
    navigate(`/search?${params.toString()}`);
  };

  const features = [
    {
      icon: <Search sx={{ fontSize: 40 }} />,
      title: 'Easy Search',
      description: 'Find buses quickly with our advanced search filters'
    },
    {
      icon: <Schedule sx={{ fontSize: 40 }} />,
      title: 'Real-time Schedule',
      description: 'Get accurate departure and arrival times'
    },
    {
      icon: <Payment sx={{ fontSize: 40 }} />,
      title: 'Secure Payment',
      description: 'Multiple payment options with secure transactions'
    },
    {
      icon: <Support sx={{ fontSize: 40 }} />,
      title: '24/7 Support',
      description: 'Round the clock customer support'
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Safe Travel',
      description: 'Verified operators and safe travel experience'
    },
    {
      icon: <DirectionsBus sx={{ fontSize: 40 }} />,
      title: 'Wide Network',
      description: 'Connect to hundreds of destinations'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: 8,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                Book Your Bus Tickets
              </Typography>
              <Typography variant="h5" paragraph>
                Travel safely and comfortably with BookMyBus. Find the best deals on bus tickets across the country.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/search')}
                sx={{
                  backgroundColor: 'white',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: 'grey.100'
                  }
                }}
              >
                Search Buses
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <DirectionsBus sx={{ fontSize: 200, opacity: 0.3 }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Search Section */}
      <Container maxWidth="md" sx={{ mt: -4, mb: 6 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom align="center">
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
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="To"
                  value={searchData.to}
                  onChange={(e) => setSearchData({ ...searchData, to: e.target.value })}
                  required
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
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<Search />}
                >
                  Search Buses
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
          Why Choose BookMyBus?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 2,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.3s ease-in-out',
                    boxShadow: theme.shadows[8]
                  }
                }}
              >
                <Box sx={{ color: theme.palette.primary.main, mb: 2 }}>
                  {feature.icon}
                </Box>
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          backgroundColor: theme.palette.grey[100],
          py: 6
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" gutterBottom align="center">
            Ready to Travel?
          </Typography>
          <Typography variant="h6" paragraph align="center" color="text.secondary">
            Join thousands of satisfied customers who trust BookMyBus for their travel needs.
          </Typography>
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{ mr: 2 }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/search')}
            >
              Search Now
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 
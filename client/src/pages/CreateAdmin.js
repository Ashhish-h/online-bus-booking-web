import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Box,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import {
  AdminPanelSettings,
  Person,
  Email,
  Phone,
  Lock,
  VpnKey
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateAdmin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    adminKey: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/auth/create-admin', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        adminKey: formData.adminKey
      });

      setSuccess('Admin user created successfully! You can now log in.');
      
      // Store the token
      localStorage.setItem('token', response.data.token);
      
      // Redirect to admin dashboard after 2 seconds
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create admin user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <AdminPanelSettings sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Create Admin Account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Set up the administrator account for your bus booking system
          </Typography>
        </Box>

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

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            margin="normal"
            InputProps={{
              startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            margin="normal"
            InputProps={{
              startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />

          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            margin="normal"
            InputProps={{
              startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            margin="normal"
            helperText="Password must be at least 6 characters long"
            InputProps={{
              startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            margin="normal"
            InputProps={{
              startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />

          <TextField
            fullWidth
            label="Admin Key"
            name="adminKey"
            value={formData.adminKey}
            onChange={handleChange}
            required
            margin="normal"
            helperText="Enter the admin key: bookmybus2024"
            InputProps={{
              startAdornment: <VpnKey sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Create Admin Account'
            )}
          </Button>
        </form>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Button
              variant="text"
              onClick={() => navigate('/login')}
              sx={{ textTransform: 'none' }}
            >
              Login here
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateAdmin; 
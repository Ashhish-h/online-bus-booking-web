import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Menu as MenuIcon, DirectionsBus } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    handleMobileMenuClose();
    navigate('/');
  };

  const navItems = [
    { text: 'Home', path: '/' },
    { text: 'Search Buses', path: '/search' },
  ];

  const authItems = isAuthenticated ? [
    { text: 'My Bookings', path: '/my-bookings' },
    { text: 'Profile', path: '/profile' },
  ] : [];

  const adminItems = user?.role === 'admin' ? [
    { text: 'Dashboard', path: '/admin' },
    { text: 'Manage Buses', path: '/admin/buses' },
    { text: 'Manage Bookings', path: '/admin/bookings' },
    { text: 'Manage Users', path: '/admin/users' },
  ] : [];

  const allItems = [...navItems, ...authItems, ...adminItems];

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <DirectionsBus />
        </IconButton>
        
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold'
          }}
        >
          BookMyBus
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              onClick={handleMobileMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={mobileMenuAnchor}
              open={Boolean(mobileMenuAnchor)}
              onClose={handleMobileMenuClose}
            >
              {allItems.map((item) => (
                <MenuItem
                  key={item.text}
                  component={Link}
                  to={item.path}
                  onClick={handleMobileMenuClose}
                >
                  {item.text}
                </MenuItem>
              ))}
              {isAuthenticated ? (
                <MenuItem onClick={handleLogout}>
                  Logout
                </MenuItem>
              ) : (
                <>
                  <MenuItem
                    component={Link}
                    to="/login"
                    onClick={handleMobileMenuClose}
                  >
                    Login
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to="/register"
                    onClick={handleMobileMenuClose}
                  >
                    Register
                  </MenuItem>
                </>
              )}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {allItems.map((item) => (
              <Button
                key={item.text}
                color="inherit"
                component={Link}
                to={item.path}
                sx={{ mx: 1 }}
              >
                {item.text}
              </Button>
            ))}
            
            {isAuthenticated ? (
              <>
                <Button
                  color="inherit"
                  onClick={handleMenuOpen}
                  sx={{ ml: 2 }}
                >
                  {user?.name}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleLogout}>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  component={Link}
                  to="/login"
                  sx={{ ml: 2 }}
                >
                  Login
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/register"
                  sx={{ ml: 1 }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 
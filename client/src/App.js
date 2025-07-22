import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateAdmin from './pages/CreateAdmin';
import BusSearch from './pages/BusSearch';
import BusDetails from './pages/BusDetails';
import BookingForm from './pages/BookingForm';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminBuses from './pages/AdminBuses';
import AdminBookings from './pages/AdminBookings';
import AdminUsers from './pages/AdminUsers';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-admin" element={<CreateAdmin />} />
          <Route path="/search" element={<BusSearch />} />
          <Route path="/bus/:id" element={<BusDetails />} />
          
          {/* Private Routes */}
          <Route path="/booking/:busId" element={
            <PrivateRoute>
              <BookingForm />
            </PrivateRoute>
          } />
          <Route path="/my-bookings" element={
            <PrivateRoute>
              <MyBookings />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/admin/buses" element={
            <AdminRoute>
              <AdminBuses />
            </AdminRoute>
          } />
          <Route path="/admin/bookings" element={
            <AdminRoute>
              <AdminBookings />
            </AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          } />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App; 
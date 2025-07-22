const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busNumber: {
    type: String,
    required: true,
    unique: true
  },
  busName: {
    type: String,
    required: true
  },
  operator: {
    type: String,
    required: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  departureTime: {
    type: String,
    required: true
  },
  arrivalTime: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  totalSeats: {
    type: Number,
    required: true,
    default: 40
  },
  availableSeats: {
    type: Number,
    required: true,
    default: 40
  },
  fare: {
    type: Number,
    required: true
  },
  busType: {
    type: String,
    enum: ['AC', 'Non-AC', 'Sleeper', 'Luxury'],
    default: 'Non-AC'
  },
  amenities: [{
    type: String,
    enum: ['WiFi', 'USB Charging', 'Water Bottle', 'Snacks', 'Blanket', 'Pillow']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient searching
busSchema.index({ from: 1, to: 1, date: 1 });

module.exports = mongoose.model('Bus', busSchema); 
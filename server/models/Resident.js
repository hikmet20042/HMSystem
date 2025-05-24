const mongoose = require('mongoose');

const residentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
  },
  residentCode: {
    type: String,
    required: true,
    unique: true
  },
  apartmentNumber: {
    type: String,
    required: true
  },
  floor: {
    type: Number,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  building: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Building',
    required: true
  },
  apartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Apartment'
  },
  registeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    default: 'resident'
  },
  readNotices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notice'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Resident', residentSchema);
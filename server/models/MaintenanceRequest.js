const mongoose = require('mongoose');

const maintenanceRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  images: [{
    data: { type: String },
    contentType: { type: String },
    filename: { type: String },
    size: { type: Number }
  }],
  status: {
    type: String,
    enum: ['pending', 'in progress', 'resolved'],
    default: 'pending'
  },
  resident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resident',
    required: true
  },
  apartment: {
    type: String,
    required: true
  },
  building: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Building',
    required: true
  },
  assignedStaff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resident',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MaintenanceRequest', maintenanceRequestSchema);
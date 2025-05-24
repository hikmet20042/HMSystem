const mongoose = require('mongoose');

const apartmentSchema = new mongoose.Schema({
  number: { type: String, required: true },
  floor: { type: Number, required: true },
  status: { 
    type: String, 
    required: true,
    enum: ['vacant', 'occupied'],
    default: 'vacant'
  },
  resident: {
    name: String,
    email: String,
    phoneNumber: String
  },
  buildingId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Building',
    required: true 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Apartment', apartmentSchema);
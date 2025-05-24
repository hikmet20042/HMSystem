const express = require('express');
const router = express.Router();
const Apartment = require('../models/Apartment');
const Building = require('../models/Building');
const Resident = require('../models/Resident');
const { protect, authorize } = require('../middleware/auth');

// Get all apartments for a specific building
router.get('/', protect, authorize('superAdmin', 'buildingAdmin'), async (req, res) => {
  const buildingId = req.query.buildingId;
  try {
    if (!buildingId) {
      return res.status(400).json({ message: 'Building ID is required' });
    }
    const apartments = await Apartment.find({ buildingId: buildingId });
    res.json(apartments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}); 
// Create new apartment for a building
router.post('/', protect, authorize('superAdmin', 'buildingAdmin'), async (req, res) => {
  const buildingId = req.query.buildingId;

  try {
    const building = await Building.findById(buildingId);
    if (!building) {
      return res.status(404).json({ message: 'Building not found' });
    }

    // Check if apartment number already exists in this building (case-insensitive with trimmed whitespace)
    const existingApartment = await Apartment.findOne({
      apartmentNumber: req.body.number,
      buildingId: buildingId
    });
 
    if (existingApartment) {
      return res.status(400).json({ message: 'Apartment number already exists in this building' });
    }

    const apartment = new Apartment({
      ...req.body,
      buildingId: buildingId
    });

    const newApartment = await apartment.save();
    res.status(201).json(newApartment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get single apartment
router.get('/:id', protect, authorize('superAdmin', 'buildingAdmin'), async (req, res) => {
  const buildingId = req.query.buildingId;

  try {
    const apartment = await Apartment.findOne({ 
      _id: req.params.id, 
      buildingId: buildingId 
    });
    
    if (!apartment) {
      return res.status(404).json({ message: 'Apartment not found' });
    }
    
    res.json(apartment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update apartment
router.put('/:id', protect, authorize('superAdmin', 'buildingAdmin'), async (req, res) => {
  const buildingId = req.query.buildingId;

  try {
    const apartment = await Apartment.findOneAndUpdate(
      { _id: req.params.id, buildingId: buildingId },
      req.body,
      { new: true }
    );
    
    if (!apartment) {
      return res.status(404).json({ message: 'Apartment not found' });
    }
    
    res.json(apartment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete apartment
router.delete('/:id', protect, authorize('superAdmin', 'buildingAdmin'), async (req, res) => {
  const buildingId = req.query.buildingId;

  try {
    const apartment = await Apartment.findOneAndDelete({
      _id: req.params.id,
      buildingId: buildingId
    });
    
    if (!apartment) {
      return res.status(404).json({ message: 'Apartment not found' });
    }
    
    res.json({ message: 'Apartment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Assign resident to apartment
router.post('/:id/assign-resident', protect, authorize('superAdmin', 'buildingAdmin'), async (req, res) => {
  const buildingId = req.query.buildingId;

  try {
    // Generate unique 5-character resident code
    const residentCode = Math.random().toString(36).substring(2, 7).toUpperCase();
    
    // Create resident record
    const resident = await Resident.create({
      fullName: req.body.name,
      email: req.body.email,
      phone: req.body.phoneNumber,
      residentCode,
      apartmentNumber: req.body.apartmentNumber,
      floor: req.body.floor,
      building: buildingId,
      registeredBy: req.user.id
    });

    const apartment = await Apartment.findOneAndUpdate(
      { _id: req.params.id, buildingId: buildingId },
      { 
        status: 'occupied',
        resident: {
          name: req.body.name,
          email: req.body.email,
          phoneNumber: req.body.phoneNumber,
          floor: req.body.floor
        }
      },
      { new: true }
    );
    
    if (!apartment) {
      return res.status(404).json({ message: 'Apartment not found' });
    }
    
    res.json({
      apartment,
      residentCode
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Remove resident from apartment and delete resident record
router.delete('/:id/resident', protect, authorize('superAdmin', 'buildingAdmin'), async (req, res) => {
  const buildingId = req.query.buildingId;

  try {
    // First find the apartment to get resident data
    const apartment = await Apartment.findOne({ _id: req.params.id, buildingId });
    console.log(apartment)
    if (!apartment) {
      return res.status(404).json({ message: 'Apartment not found' });
    }

    // Delete resident record if exists
    if (apartment.resident) {
      await Resident.findOneAndDelete({
        apartmentNumber: apartment.number,
        floor: apartment.floor,
        building: buildingId
      });
    }

    // Update apartment to remove resident data
    await Apartment.findOneAndUpdate(
      { _id: req.params.id, buildingId },
      { 
        $unset: { resident: '' },
        status: 'vacant'
      },
      { new: true }
    );
    
    res.json({ message: 'Resident removed and apartment marked as vacant' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
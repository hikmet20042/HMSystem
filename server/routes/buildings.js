const express = require('express');
const router = express.Router();
const Building = require('../models/Building');
const { protect, authorize } = require('../middleware/auth');

// @route   POST api/buildings
// @desc    Create a new building
// @access  Private/Admin
router.post('/', protect, authorize('superAdmin', 'buildingAdmin'), async (req, res) => {
  try {
    const { name, address, totalFloors, totalApartments } = req.body;
    
    if (!name || !address || !totalFloors || !totalApartments) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Create new building document which will automatically create collection
    const building = new Building({
      name,
      address,
      totalFloors,
      totalApartments,
      createdBy: req.user.id
    });

    await building.save();
    res.status(201).json(building);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/buildings
// @desc    Get all buildings
// @access  Private/Admin
router.get('/', protect, authorize('superAdmin', 'buildingAdmin'), async (req, res) => {
  try {
    let filter = {};
    
    // Building admins can only see buildings they created
    if (req.user.role === 'buildingAdmin') {
      filter.createdBy = req.user.id;
    }
    
    const buildings = await Building.find(filter);
    
    // Return empty array if no buildings exist instead of error
    if (!buildings || buildings.length === 0) {
      return res.json([]);
    }
    
    res.json(buildings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/buildings/:buildingId/validate
// @desc    Validate building ID
// @access  Private/Admin
router.get('/validate', protect, authorize('superAdmin', 'buildingAdmin'), async (req, res) => {
  try {
    let query = { _id: req.query.buildingId };
    
    // Building admins can only validate buildings they created
    if (req.user.role === 'buildingAdmin') {
      query.createdBy = req.user.id;
    }
    
    const building = await Building.findOne(query);
    
    if (!building) {
      return res.status(404).json({ message: 'Building not found or not authorized' });
    }
    
    res.json(building);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
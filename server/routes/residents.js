const express = require('express');
const router = express.Router();
const Resident = require('../models/Resident');
const Building = require('../models/Building');
const { protect, authorize } = require('../middleware/auth');
const generateResidentCode = require('../utils/residentCodeGenerator');

// @route   POST api/residents
// @desc    Add resident to apartment
// @access  Private/Admin
router.post('/', protect, authorize('buildingAdmin'), async (req, res) => {
  try {
    const { fullName, email, password, apartmentNumber, floor, phone, building } = req.body;
    const residentCode = generateResidentCode();
    
    // Check if building exists
    const buildingExists = await Building.findById(building);
    if (!buildingExists) {
      return res.status(400).json({ message: 'Building not found' });
    }

    const resident = new Resident({
      fullName,
      email,
      password,
      residentCode,
      apartmentNumber,
      floor,
      phone,
      building,
      status: 'occupied'
    });

    await resident.save();
    res.status(201).json(resident);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/residents
// @desc    List & filter residents
// @access  Private/Admin
router.get('/', protect, authorize('buildingAdmin'), async (req, res) => {
  try {
    const { building, status } = req.query;
    const filter = {};
    
    if (building) filter.building = building;
    if (status) filter.status = status;
    
    const residents = await Resident.find(filter).populate('building');
    res.json(residents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/residents/:buildingId/residents
// @desc    Get all residents for a specific building
// @access  Private/Admin
router.get('/residents', protect, authorize('buildingAdmin'), async (req, res) => {
  try {
    const residents = await Resident.find({ building: req.query.buildingId })
      .select('name apartmentNumber');
    res.json(residents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/residents/:id
// @desc    Update resident information
// @access  Private/Resident
router.put('/:id', async (req, res) => {
  console.log(req.body)
  try {
    const {residentCode, password } = req.body;
    
    const resident = await Resident.findOne({ residentCode });
    if (!resident) {
      return res.status(404).json({ message: 'Resident not found' });
    }
    
    // Update fields
    if (password) {
      resident.password = password;
      await resident.save();
      // Password will be hashed by the pre-save hook in the Resident model
    } else {
      await resident.save();
    }
    res.json(resident);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
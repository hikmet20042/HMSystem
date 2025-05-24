const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');
const { protect, authorize } = require('../middleware/auth');
const Building = require('../models/Building');
const MaintenanceRequest = require('../models/MaintenanceRequest');



// @route   POST api/staff
// @desc    Add staff member
// @access  Private/Admin
router.post('/', protect, authorize('buildingAdmin'), async (req, res) => {
    const buildingId = req.query.buildingId;
  try {
    const { name, surname, email, password, phone } = req.body;
    
    // Check if building exists
    const buildingExists = await Building.findById(buildingId);
    if (!buildingExists) {
      return res.status(400).json({ message: 'Building not found' });
    }

    const staff = new Staff({
      name,
      surname,
      email,
      password,
      phone,
      building: buildingId,
      registeredBy: req.user.id
    });

    await staff.save();
    res.status(201).json(staff);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/staff
// @desc    List staff members
// @access  Private/Admin
router.get('/', protect, authorize('buildingAdmin'), async (req, res) => {
  try {
    const staffMembers = await Staff.find().populate('building');
    res.json(staffMembers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/staff/:id
// @desc    Update staff information
// @access  Private/Admin
router.put('/:id', protect, authorize('buildingAdmin'), async (req, res) => {
  try {
    const { name, surname, email, phone } = req.body;
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    staff.name = name || staff.name;
    staff.surname = surname || staff.surname;
    staff.email = email || staff.email;
    staff.phone = phone || staff.phone;

    await staff.save();
    res.json(staff);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/staff/:id
// @desc    Delete staff member
// @access  Private/Admin
router.delete('/:id', protect, authorize('buildingAdmin'), async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    res.json({ message: 'Staff member deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/staff/requests
// @desc    Get all maintenance requests for staff
// @access  Private/Staff
router.get('/requests', protect, authorize('staff'), async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find()
      .populate('resident')
      .populate('apartment')
      .populate('building');
    
    res.json(requests.map(request => ({
      id: request._id,
      title: request.title,
      description: request.description,
      status: request.status,
      submissionDate: request.createdAt,
      apartmentNumber: request.apartment,
      floor: request.building.floor,
      contactNumber: request.resident.phone,
      images: request.images && Array.isArray(request.images) ? request.images.map(img => img.data) : []
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH api/staff/requests/:id
// @desc    Update maintenance request status
// @access  Private/Staff
router.patch('/requests/:id', protect, authorize('staff'), async (req, res) => {
  try {
    const { status } = req.body;
    const request = await MaintenanceRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
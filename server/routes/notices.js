const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const Building = require('../models/Building');
const Resident = require('../models/Resident');
const { protect, authorize } = require('../middleware/auth');
const mongoose = require('mongoose');
// @route   POST api/notices
// @desc    Admin creates notice
// @access  Private/Admin
router.post('/', protect, authorize('buildingAdmin'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const buildingId = req.query.buildingId;
    if (!buildingId || buildingId === 'undefined') {
      return res.status(400).json({ message: 'Building ID is required' });
    }

    // Check if building exists
    if (!mongoose.Types.ObjectId.isValid(buildingId)) {
      return res.status(400).json({ message: 'Invalid building ID format' });
    }
    const buildingExists = await Building.findById(buildingId);
    if (!buildingExists) {
      return res.status(400).json({ message: 'Building not found' });
    }

    const notice = new Notice({
      title,
      description,
      createdBy: req.user.id,
      building: buildingId
    });

    await notice.save();
    res.status(201).json(notice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/notices
// @desc    Residents fetch notices
// @access  Private
router.get('/', protect, authorize('buildingAdmin', "resident"), async (req, res) => {
  const buildingId = req.query.buildingId;
  if (!buildingId || buildingId === 'undefined') {
    return res.status(400).json({ message: 'Building ID is required' });
  }
  try {
    let notices;

    if (req.user.role === 'resident') {
      const resident = await Resident.findById(req.user.id);
      if (!resident) {
        return res.status(400).json({ message: 'Resident not found' });
      }

      notices = await Notice.find(
        { building: buildingId },


      ).populate('createdBy').populate('building');
    } else {
      // For admin/staff, get all notices for their buildings
      notices = await Notice.find({ building: buildingId })
        .populate('createdBy')
        .populate('building');
    }

    res.json(notices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/recent', protect, authorize('superAdmin', 'buildingAdmin'), async (req, res) => {
  try {
    let query = { building: req.query.buildingId };

    // Building admins can only see notices for buildings they created
    if (req.user.role === 'buildingAdmin') {
      const building = await Building.findOne({
        _id: req.query.buildingId,
        createdBy: req.user.id
      });

      if (!building) {
        return res.status(404).json({ message: 'Building not found or not authorized' });
      }
    }

    const notices = await Notice.find(query)
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('createdBy', 'name');

    res.json(notices || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
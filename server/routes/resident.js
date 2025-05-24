const express = require('express');
const router = express.Router();
const Resident = require('../models/Resident');
const { protect,authorize } = require('../middleware/auth');
const MaintenanceRequest = require('../models/MaintenanceRequest');
const Notice = require('../models/Notice');
const upload = require('../middleware/upload');



// @route   GET api/resident/info
// @desc    Get resident information
// @access  Private/Resident
router.get('/info', protect, authorize("resident"), async (req, res) => {
  try {
    const resident = await Resident.findById(req.user.id)
      .select('name apartmentNumber floor');
    
    if (!resident) {
      return res.status(404).json({ message: 'Resident not found' });
    }
    
    res.json({
      name: resident.fullName,
      apartmentNumber: resident.apartmentNumber,
      floor: resident.floor,
      nextPaymentDue: '2023-12-01' // Mock data
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/resident/maintenance-requests
// @desc    Get resident's maintenance requests
// @access  Private/Resident
router.get('/maintenance-requests', protect, authorize("resident"), async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find({ createdBy: req.user.id })
      .populate('resident')
      .populate('apartment')
      .populate('building');
    
    res.json(requests.map(request => ({
      id: request._id,
      title: request.title,
      description: request.description,
      status: request.status,
      createdAt: request.createdAt,
      images: request.images && Array.isArray(request.images) ? request.images.map(img => ({
        id: img._id,
        contentType: img.contentType,
        filename: img.filename,
        size: img.size,
        data: img.data ? `data:${img.contentType};base64,${img.data}` : ''
      })) : []
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/resident/maintenance-requests
// @desc    Create new maintenance request
// @access  Private/Resident
router.post('/maintenance-requests', protect, authorize("resident"), upload.array('images', 5), async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    
    const resident = await Resident.findById(req.user.id);
    if (!resident) {
      return res.status(404).json({ message: 'Resident not found' });
    }
    
    const newRequest = new MaintenanceRequest({
      title,
      description,
      status: 'pending',
      createdBy: req.user.id,
      resident: req.user.id,
      building: resident.building,
      apartment: resident.apartmentNumber,
      images: req.files && Array.isArray(req.files) ? req.files.map(file => ({
        data: file.buffer ? file.buffer.toString('base64') : '',
        contentType: file.mimetype || '',
        filename: file.originalname || '',
        size: file.size || 0
      })) : []
    });
    
    const savedRequest = await newRequest.save();
    
    res.status(201).json({
      id: savedRequest._id,
      title: savedRequest.title,
      description: savedRequest.description,
      status: savedRequest.status,
      createdAt: savedRequest.createdAt,
      images: savedRequest.images.map(img => ({
        id: img._id,
        contentType: img.contentType,
        filename: img.filename,
        size: img.size,
        data: img.data ? `data:${img.contentType};base64,${img.data}` : ''
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/resident/notices
// @desc    Get notices for resident
// @access  Private/Resident
router.get('/notices', protect, authorize("resident"), async (req, res) => {
  try {
    const resident = await Resident.findById(req.user.id);
    if (!resident) {
      return res.status(404).json({ message: 'Resident not found' });
    }
    
    const notices = await Notice.find({
      building: resident.building
    })
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 });
    
    res.json(notices.map(notice => ({
      id: notice._id,
      title: notice.title,
      description: notice.description,
      sender: notice.createdBy.name,
      date: notice.createdAt.toISOString().split('T')[0]
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH api/resident/notices/:id/read
// @desc    Mark notice as read/unread for resident
// @access  Private/Resident
router.patch('/notices/:id/read', protect, authorize('resident'), async (req, res) => {
  try {
    const resident = await Resident.findById(req.user.id);
    if (!resident) {
      return res.status(404).json({ message: 'Resident not found' });
    }

    const noticeId = req.params.id;
    if (!noticeId) {
      return res.status(400).json({ message: 'Notice ID is required' });
    }
    const noticeIndex = resident.readNotices.indexOf(noticeId);

    if (noticeIndex === -1) {
      // Add to read notices
      resident.readNotices.push(noticeId);
    } else {
      // Remove from read notices
      resident.readNotices.splice(noticeIndex, 1);
    }

    await resident.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/resident/notices/unread-count
// @desc    Get count of unread notices for resident
// @access  Private/Resident
router.get('/notices/unread-count', protect, authorize('resident'), async (req, res) => {
  try {
    const resident = await Resident.findById(req.user.id).populate('readNotices');
    if (!resident) {
      return res.status(404).json({ message: 'Resident not found' });
    }

    const buildingId = resident.building;
    const totalNotices = await Notice.countDocuments({ building: buildingId });
    const unreadCount = totalNotices - resident.readNotices.length;

    res.json({ count: unreadCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
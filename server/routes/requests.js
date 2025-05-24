const express = require('express');
const router = express.Router();
const MaintenanceRequest = require('../models/MaintenanceRequest');
const Resident = require('../models/Resident');
const Building = require('../models/Building');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   POST api/maintenance
// @desc    Resident submits maintenance request
// @access  Private/Resident
router.post('/', protect, authorize('resident'), upload.array('images', 5), async (req, res) => {
  try {
    const { title, description, images } = req.body;

    const resident = await Resident.findById(req.user.id);
    if (!resident) {
      return res.status(400).json({ message: 'Resident not found' });
    }

    const maintenanceRequest = new MaintenanceRequest({
      title,
      description,
      images,
      resident: req.user.id,
      building: resident.building,
      status: 'pending'
    });

    await maintenanceRequest.save();
    res.status(201).json(maintenanceRequest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/maintenance
// @desc    Admin/staff view requests (filterable)
// @access  Private/Admin or Staff
router.get('/', protect, authorize('buildingAdmin', 'staff'), async (req, res) => {
  try {
    const { status, buildingId } = req.query;
    const filter = {};

    if (status) filter.status = status;

    // If buildingId is provided, filter by it
    if (buildingId) {
      filter.building = buildingId;
    } else if (req.user.role === 'buildingAdmin') {
      // Building admin can only see requests for their buildings
      filter.building = { $in: await Building.find({ createdBy: req.user.id }).distinct('_id') };
    }

    // Staff can only see requests assigned to them
    if (req.user.role === 'staff') {
      filter.assignedStaff = req.user.id;
    }

    const requests = await MaintenanceRequest.find(filter)
      .populate({
        path: 'resident',
        select: 'fullName phone',
      })
      .populate({
        path: 'apartment',
        select: 'number',
      })
      .populate('building')
      .populate({
        path: 'assignedStaff',
        select: 'name',
      });

    // Format response for frontend
    const formatted = requests.map(request => ({
      id: request._id,
      title: request.title,
      apartmentNumber: request.apartment ? request.apartment : request.apartmentNumber,
      residentName: request.resident ? request.resident.fullName : request.residentName,
      contactNumber: request.resident ? request.resident.phone : request.contactNumber,
      submissionDate: request.createdAt,
      status: request.status,
      description: request.description,
      images: request.images || [],
      assignedStaffId: request.assignedStaff ? request.assignedStaff._id : '',
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/maintenance/:id/status
// @desc    Staff updates request status
// @access  Private/Staff
router.put('/:id/status', protect, authorize("buildingAdmin"), async (req, res) => {
  try {
    const { status, assignedStaffId } = req.body;

    const request = await MaintenanceRequest.findOne({
      _id: req.params.id,
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found ' });
    }

    request.status = status;
    if (status === 'in progress') {
      request.assignedStaff = assignedStaffId || req.user.id;
    }

    await request.save();
    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/recent', protect, authorize('superAdmin', 'buildingAdmin'), async (req, res) => {
  try {
    let query = { building: req.query.buildingId };

    // Building admins can only see requests for buildings they created
    if (req.user.role === 'buildingAdmin') {
      const building = await Building.findOne({
        _id: req.query.buildingId,
        createdBy: req.user.id
      });

      if (!building) {
        return res.status(404).json({ message: 'Building not found or not authorized' });
      }
    }

    const requests = await MaintenanceRequest.find(query)
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('resident', 'fullName apartmentNumber');

    res.json(requests || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Building = require('../models/Building');
const Resident = require('../models/Resident');
const Apartment = require('../models/Apartment');
const MaintenanceRequest = require('../models/MaintenanceRequest');
const Notice = require('../models/Notice');
const { protect, authorize } = require('../middleware/auth');

// @route   GET api/buildings/:buildingId/stats
// @desc    Get building dashboard statistics
// @access  Private/Admin
router.get('/', protect, authorize('superAdmin', 'buildingAdmin'), async (req, res) => {
  try {
    let query = { _id: req.query.buildingId };
    
    // Building admins can only see stats for buildings they created
    if (req.user.role === 'buildingAdmin') {
      query.createdBy = req.user.id;
    }
    const building = await Building.findOne(query);
    
    if (!building) {
      return res.status(404).json({ message: 'Building not found or not authorized' });
    }
    
    // Get statistics
    const totalResidents = await Resident.countDocuments({ building: building._id });
    const vacantApartments = await Apartment.countDocuments({ 
      buildingId: building._id, 
      status: "vacant" 
    });
    const occupiedApartments = await Apartment.countDocuments({ 
      buildingId: building._id, 
      status: "occupied" 
    });
    
    const [totalRequests, pendingRequests, completedRequests] = await Promise.all([
      MaintenanceRequest.countDocuments({ building: building._id }),
      MaintenanceRequest.countDocuments({ building: building._id, status: 'pending' }),
      MaintenanceRequest.countDocuments({ building: building._id, status: 'completed' })
    ]);
    
    res.json({
      totalResidents,
      vacantApartments,
      totalApartments: building.totalApartments,
      occupiedApartments,
      totalRequests,
      pendingRequests,
      inProgressRequests: await MaintenanceRequest.countDocuments({ 
        building: building._id, 
        status: 'in_progress' 
      }),
      completedRequests,
      noticesCount: await Notice.countDocuments({ building: building._id }),
      
     
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
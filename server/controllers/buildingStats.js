const Building = require('../models/Building');
const MaintenanceRequest = require('../models/MaintenanceRequest');
const Notice = require('../models/Notice');
const Resident = require('../models/Resident');

// Get building dashboard statistics
exports.getBuildingStats = async (req, res) => {
  try {
    const buildingId = req.params.buildingId;
    
    // Validate building exists
    const building = await Building.findById(buildingId);
    if (!building) {
      return res.status(404).json({ message: 'Building not found' });
    }
    
    // Get pending maintenance requests count
    const pendingRequests = await MaintenanceRequest.countDocuments({
      building: buildingId,
      status: 'pending'
    });
    
    // Get latest notices (limit to 5)
    const latestNotices = await Notice.find({ building: buildingId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('createdBy', 'name');
    
    // Get request status distribution
    const statusDistribution = await MaintenanceRequest.aggregate([
      { $match: { building: buildingId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Get total residents count
    const totalResidents = await Resident.countDocuments({ building: buildingId });
    
    res.json({
      pendingRequests,
      latestNotices,
      statusDistribution,
      totalResidents,
      buildingName: building.name
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = exports;
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Resident = require('../models/Resident');
const Staff = require('../models/Staff');

exports.protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.role === 'resident') {
        req.user = await Resident.findById(decoded.id).select('-password');
      } else if (decoded.role === 'staff') {
        req.user = await Staff.findById(decoded.id).select('-password');
      } else {
        req.user = await User.findById(decoded.id).select('-password');
      }
      
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};
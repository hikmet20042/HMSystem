const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Resident = require('../models/Resident');
const Staff = require('../models/Staff');

// Validation middleware
const registerValidation = [
  check('name').notEmpty().withMessage('Name is required'),
  check('surname').notEmpty().withMessage('Surname is required'),
  check('email').isEmail().withMessage('Please include a valid email'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  check('phoneNumber').notEmpty().withMessage('Phone number is required'),
  check('role').isIn(['buildingAdmin', 'resident']).withMessage('Invalid role'),

  check('residentCode').if(check('role').equals('resident')).notEmpty().withMessage('Resident code is required')
];

const loginValidation = [
  check('email').isEmail().withMessage('Please include a valid email'),
  check('password').exists().withMessage('Password is required'),
  check('role').isIn(['superAdmin', 'buildingAdmin', 'resident', 'staff']).withMessage('Invalid role')
];

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, role } = req.body;

    // Check if registration is allowed for this role
    if (!['buildingAdmin', 'resident'].includes(role)) {
      return res.status(400).json({ message: 'Registration not allowed for this role' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    user = new User(req.body);
    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, role } = req.body;

    // Check if user exists
    let user;
    if (role === 'resident') {
      const resident = await Resident.findOne({ email });
      if (!resident) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      // For residents, check password directly without encryption
      if (resident.password !== password) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      user = resident;

    } else {
      user = await User.findOne({ email }) ;
      if(!user) {user = await Staff.findOne({ email })}

      
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      // Verify role matches
      if (role === 'buildingAdmin') {
        // Allow staff and superAdmin to login through buildingAdmin role
        // Check if user is staff trying to login as buildingAdmin
        
        if (user.role === 'staff') {
          const staff = await Staff.findOne({ email });
          if (!staff) {
            return res.status(400).json({ message: 'Invalid credentials' });
          }
          if (staff.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
          }
          user = staff;
        } 
      }

      // Check password for non-resident and non-staff users
      if(user.role !=='staff'){
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }}
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
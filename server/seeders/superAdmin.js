require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seedSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Check if superAdmin already exists
    const existingSuperAdmin = await User.findOne({ role: 'superAdmin' });
    if (existingSuperAdmin) {
      console.log('SuperAdmin already exists');
      process.exit(0);
    }

    // Create superAdmin
    const superAdmin = new User({
      name: 'Super',
      surname: 'Admin',
      email: 'superadmin@hmss.com',
      password: 'SuperAdmin@123', // This will be hashed automatically
      phoneNumber: '1234567890',
      role: 'superAdmin'
    });

    await superAdmin.save();
    console.log('SuperAdmin created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding superAdmin:', error);
    process.exit(1);
  }
};

seedSuperAdmin();
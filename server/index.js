require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
// Building context middleware
app.use('/api/buildings', (req, res, next) => {
  if (req.user && req.user.buildingId) {
    req.buildingId = req.user.buildingId;
  }
  next();
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/buildings', require('./routes/buildings'));
app.use('/api/residents', require('./routes/residents'));
app.use('/api/notices', require('./routes/notices'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/stats', require('./routes/buildingStats'));
app.use('/api/apartments', require('./routes/apartments'));
app.use('/api/resident', require('./routes/resident'));
app.use('/api/staff', require('./routes/staff'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth, protect } = require('../middleware/auth');
const {
  register,
  login,
  getMe,
  updateProfile,
} = require('../controllers/authController');

// Register user
router.post('/register', register);

// Login user
router.post('/login', login);

// Get current user
router.get('/me', auth, getMe);

// Update user profile
router.put('/profile', auth, updateProfile);

// Sign out (client-side only)
router.post('/signout', auth, (req, res) => {
  res.json({ message: 'Signed out successfully' });
});

module.exports = router; 
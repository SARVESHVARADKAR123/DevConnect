const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Update user profile
router.patch('/profile', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'bio', 'githubLink', 'skills', 'profilePicture'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates' });
  }

  try {
    updates.forEach(update => req.user[update] = req.body[update]);
    await req.user.save();
    res.json(req.user.getPublicProfile());
  } catch (error) {
    res.status(400).json({ message: 'Error updating profile' });
  }
});

// Get user's projects
router.get('/projects', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('projects')
      .populate('joinedProjects');
    res.json({
      ownedProjects: user.projects,
      joinedProjects: user.joinedProjects
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

// Get user's projects by ID
router.get('/:id/projects', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate({
        path: 'projects',
        populate: {
          path: 'owner contributors.user',
          select: 'name profilePicture'
        }
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user projects' });
  }
});

// Search users
router.get('/search/:query', async (req, res) => {
  try {
    const searchQuery = req.params.query;
    const users = await User.find({
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } }
      ]
    })
    .select('name email profilePicture bio')
    .limit(10);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error searching users' });
  }
});

module.exports = router; 
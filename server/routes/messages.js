const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Project = require('../models/Project');
const { auth } = require('../middleware/auth');

// Get messages for a project
router.get('/:projectId', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner or contributor
    const isOwner = project.owner.toString() === req.user._id.toString();
    const isContributor = project.contributors.some(
      c => c.toString() === req.user._id.toString()
    );

    if (!isOwner && !isContributor) {
      return res.status(403).json({ message: 'Not authorized to view messages' });
    }

    const messages = await Message.find({ project: req.params.projectId })
      .populate('sender', 'name profilePicture')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// Send a new message
router.post('/', auth, async (req, res) => {
  try {
    const { projectId, content } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner or contributor
    const isOwner = project.owner.toString() === req.user._id.toString();
    const isContributor = project.contributors.some(
      c => c.toString() === req.user._id.toString()
    );

    if (!isOwner && !isContributor) {
      return res.status(403).json({ message: 'Not authorized to send messages' });
    }

    const message = new Message({
      project: projectId,
      sender: req.user._id,
      content
    });

    await message.save();
    await message.populate('sender', 'name profilePicture');

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
});

module.exports = router; 
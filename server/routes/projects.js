const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const { auth, isProjectOwner, isProjectContributor } = require('../middleware/auth');

// Get all projects
router.get('/', async (req, res) => {
  try {
    const { tags } = req.query;
    const query = {};

    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    const projects = await Project.find(query)
      .populate('owner', 'name profilePicture')
      .sort({ createdAt: -1 });

    res.json(projects.map(project => project.getPublicData()));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects.' });
  }
});

// Get single project
router.get('/:projectId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate('owner', 'name profilePicture')
      .populate('contributors.user', 'name profilePicture');

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    res.json(project.getPublicData());
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project.' });
  }
});

// Create project
router.post('/', auth, async (req, res) => {
  try {
    console.log('Project creation request received:', {
      body: req.body,
      user: req.user._id,
      headers: req.headers
    });

    const { title, description, tags, category = 'other' } = req.body;
    
    // Validate required fields
    if (!title || !description) {
      console.log('Validation failed: Missing required fields', { title, description });
      return res.status(400).json({ 
        message: 'Validation error', 
        details: ['Title and description are required']
      });
    }

    // Validate field lengths
    if (title.length < 3) {
      return res.status(400).json({
        message: 'Validation error',
        details: ['Title must be at least 3 characters long']
      });
    }

    if (description.length < 10) {
      return res.status(400).json({
        message: 'Validation error',
        details: ['Description must be at least 10 characters long']
      });
    }

    // Validate category
    const validCategories = ['web', 'mobile', 'desktop', 'ai', 'game', 'other'];
    if (!validCategories.includes(category)) {
      console.log('Validation failed: Invalid category', { category });
      return res.status(400).json({
        message: 'Validation error',
        details: [`Category must be one of: ${validCategories.join(', ')}`]
      });
    }

    console.log('Creating project with data:', { 
      title, 
      description, 
      tags, 
      category,
      owner: req.user._id 
    });

    // Generate a unique chat room ID using timestamp and random string
    const chatRoomId = `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log('Generated chat room ID:', chatRoomId);

    const project = new Project({
      title,
      description,
      tags: tags || [],
      category,
      owner: req.user._id,
      chatRoom: chatRoomId,
    });

    console.log('Project object created:', JSON.stringify(project, null, 2));

    try {
      await project.save();
      console.log('Project saved successfully');
    } catch (saveError) {
      console.error('Error saving project:', saveError);
      if (saveError.code === 11000) {
        return res.status(400).json({
          message: 'Validation error',
          details: ['A project with this title already exists']
        });
      }
      throw saveError;
    }

    try {
      // Add project to user's projects
      req.user.projects.push(project._id);
      await req.user.save();
      console.log('Project added to user');
    } catch (userSaveError) {
      console.error('Error updating user:', userSaveError);
      // If we fail to update the user, we should delete the project
      await Project.findByIdAndDelete(project._id);
      throw userSaveError;
    }

    res.status(201).json(project.getPublicData());
  } catch (error) {
    console.error('Error creating project:', error);
    console.error('Error stack:', error.stack);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      console.log('Validation errors:', validationErrors);
      return res.status(400).json({ 
        message: 'Validation error', 
        details: validationErrors
      });
    }
    
    res.status(500).json({ 
      message: 'Error creating project',
      error: error.message,
      details: error.stack
    });
  }
});

// Update project
router.patch('/:projectId', auth, isProjectOwner, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'description', 'tags', 'status', 'repository', 'website'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates.' });
  }

  try {
    updates.forEach(update => req.project[update] = req.body[update]);
    await req.project.save();
    res.json(req.project.getPublicData());
  } catch (error) {
    res.status(500).json({ message: 'Error updating project.' });
  }
});

// Delete project
router.delete('/:projectId', auth, isProjectOwner, async (req, res) => {
  try {
    await req.project.remove();
    res.json({ message: 'Project deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project.' });
  }
});

// Request to contribute
router.post('/:projectId/request', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    // Check if user is already a contributor
    if (project.isContributor(req.user._id)) {
      return res.status(400).json({ message: 'Already a contributor.' });
    }

    // Check if user already has a pending request
    const existingRequest = project.pendingContributors.find(
      request => request.user.toString() === req.user._id.toString()
    );

    if (existingRequest) {
      return res.status(400).json({ message: 'Request already pending.' });
    }

    project.pendingContributors.push({
      user: req.user._id,
      status: 'pending',
    });

    await project.save();
    res.json({ message: 'Contribution request sent.' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending request.' });
  }
});

// Accept contribution request
router.post('/:projectId/accept/:userId', auth, isProjectOwner, async (req, res) => {
  try {
    const request = req.project.pendingContributors.find(
      request => request.user.toString() === req.params.userId
    );

    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    request.status = 'accepted';
    req.project.contributors.push({
      user: req.params.userId,
      role: 'contributor',
    });

    await req.project.save();
    res.json({ message: 'Request accepted.' });
  } catch (error) {
    res.status(500).json({ message: 'Error accepting request.' });
  }
});

// Reject contribution request
router.post('/:projectId/reject/:userId', auth, isProjectOwner, async (req, res) => {
  try {
    const request = req.project.pendingContributors.find(
      request => request.user.toString() === req.params.userId
    );

    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    request.status = 'rejected';
    await req.project.save();
    res.json({ message: 'Request rejected.' });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting request.' });
  }
});

module.exports = router; 
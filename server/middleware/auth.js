const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Project = require('../models/Project');

const auth = async (req, res, next) => {
  try {
    console.log('Auth middleware - Headers:', req.headers);
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Auth middleware - Token:', token ? 'Present' : 'Missing');

    if (!token) {
      console.log('Auth middleware - No token provided');
      return res.status(401).json({ message: 'Authentication required.' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Auth middleware - Token decoded:', { userId: decoded.userId });
      
      const user = await User.findById(decoded.userId);
      console.log('Auth middleware - User found:', user ? 'Yes' : 'No');

      if (!user) {
        console.log('Auth middleware - User not found');
        return res.status(401).json({ message: 'User not found.' });
      }

      req.token = token;
      req.user = user;
      next();
    } catch (error) {
      console.error('Auth middleware - Token verification failed:', error);
      return res.status(401).json({ message: 'Invalid token.' });
    }
  } catch (error) {
    console.error('Auth middleware - Error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Middleware to check if user is project owner
const isProjectOwner = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    if (!project.isOwner(req.user._id)) {
      return res.status(403).json({ message: 'Access denied. Project owner only.' });
    }

    req.project = project;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Middleware to check if user is project contributor
const isProjectContributor = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    if (!project.isContributor(req.user._id) && !project.isOwner(req.user._id)) {
      return res.status(403).json({ message: 'Access denied. Project contributors only.' });
    }

    req.project = project;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};

module.exports = {
  auth,
  isProjectOwner,
  isProjectContributor,
  protect,
  authorize,
}; 
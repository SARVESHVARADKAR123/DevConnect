const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a project title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a project description'],
      trim: true,
    },
    tags: [String],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    contributors: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      role: {
        type: String,
        enum: ['developer', 'designer', 'manager'],
        default: 'developer',
      },
      joinedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    repository: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'archived'],
      default: 'active',
    },
    chatRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatRoom',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for contributor count
projectSchema.virtual('contributorCount').get(function() {
  return this.contributors.length;
});

// Method to check if user is a contributor
projectSchema.methods.isContributor = function(userId) {
  return this.contributors.some(contributor => 
    contributor.user.toString() === userId.toString()
  );
};

// Method to check if user is the owner
projectSchema.methods.isOwner = function(userId) {
  return this.owner.toString() === userId.toString();
};

// Method to get public project data
projectSchema.methods.getPublicData = function() {
  const projectObject = this.toObject();
  projectObject.contributorCount = this.contributorCount;
  return projectObject;
};

// Pre-save middleware to ensure owner is in contributors
projectSchema.pre('save', function(next) {
  if (this.isNew) {
    // Ensure owner is in contributors
    const ownerExists = this.contributors.some(
      contributor => contributor.user.toString() === this.owner.toString()
    );
    
    if (!ownerExists) {
      this.contributors.push({
        user: this.owner,
        role: 'owner',
        joinedAt: new Date()
      });
    }
  }
  next();
});

// Index for search functionality
projectSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Project', projectSchema); 
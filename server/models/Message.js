const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['text', 'system'],
    default: 'text',
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    readAt: {
      type: Date,
      default: Date.now,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
});

// Add indexes for better query performance
messageSchema.index({ project: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });

// Method to get message with sender info
messageSchema.methods.getPublicData = async function() {
  await this.populate('sender', 'name profilePicture');
  const messageObject = this.toObject();
  return {
    ...messageObject,
    sender: {
      id: messageObject.sender._id,
      name: messageObject.sender.name,
      profilePicture: messageObject.sender.profilePicture,
    },
  };
};

const Message = mongoose.model('Message', messageSchema);

module.exports = Message; 
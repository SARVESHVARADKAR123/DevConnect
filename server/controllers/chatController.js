const ChatRoom = require('../models/ChatRoom');
const Project = require('../models/Project');

// @desc    Get chat room messages
// @route   GET /api/chat/:projectId/messages
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check if user is project owner or contributor
    const isParticipant =
      project.owner.toString() === req.user.id ||
      project.contributors.some((c) => c.user.toString() === req.user.id);

    if (!isParticipant) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access chat',
      });
    }

    const chatRoom = await ChatRoom.findById(project.chatRoom)
      .populate('messages.sender', 'name profilePicture')
      .populate('messages.readBy.user', 'name');

    if (!chatRoom) {
      return res.status(404).json({
        success: false,
        message: 'Chat room not found',
      });
    }

    res.json({
      success: true,
      data: chatRoom.messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// @desc    Send message
// @route   POST /api/chat/:projectId/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check if user is project owner or contributor
    const isParticipant =
      project.owner.toString() === req.user.id ||
      project.contributors.some((c) => c.user.toString() === req.user.id);

    if (!isParticipant) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to send messages',
      });
    }

    const chatRoom = await ChatRoom.findById(project.chatRoom);

    if (!chatRoom) {
      return res.status(404).json({
        success: false,
        message: 'Chat room not found',
      });
    }

    // Add message
    const message = {
      content,
      sender: req.user.id,
      readBy: [{ user: req.user.id }],
    };

    chatRoom.messages.push(message);
    chatRoom.lastMessage = Date.now();
    await chatRoom.save();

    // Populate sender info
    const populatedMessage = await ChatRoom.populate(chatRoom, {
      path: 'messages.sender',
      select: 'name profilePicture',
    });

    const newMessage = populatedMessage.messages[populatedMessage.messages.length - 1];

    res.json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// @desc    Mark message as read
// @route   PUT /api/chat/:projectId/messages/:messageId/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const chatRoom = await ChatRoom.findById(project.chatRoom);

    if (!chatRoom) {
      return res.status(404).json({
        success: false,
        message: 'Chat room not found',
      });
    }

    const message = chatRoom.messages.id(req.params.messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    // Check if already read by user
    const isRead = message.readBy.some(
      (read) => read.user.toString() === req.user.id
    );

    if (!isRead) {
      message.readBy.push({
        user: req.user.id,
        readAt: Date.now(),
      });
      await chatRoom.save();
    }

    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
}; 
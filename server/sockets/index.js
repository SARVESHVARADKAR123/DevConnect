const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');
const Project = require('../models/Project');

const setupSocketHandlers = (io) => {
  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.name}`);

    // Join project room
    socket.on('joinRoom', async ({ roomId }) => {
      try {
        const project = await Project.findById(roomId);
        
        if (!project) {
          socket.emit('error', { message: 'Project not found' });
          return;
        }

        // Check if user is a contributor or owner
        if (!project.isContributor(socket.user._id) && !project.isOwner(socket.user._id)) {
          socket.emit('error', { message: 'Not authorized to join this room' });
          return;
        }

        socket.join(project.chatRoom);
        console.log(`${socket.user.name} joined room: ${project.chatRoom}`);

        // Send last 50 messages
        const messages = await Message.find({ project: roomId })
          .sort({ createdAt: -1 })
          .limit(50)
          .populate('sender', 'name profilePicture');

        socket.emit('previousMessages', messages.reverse());
      } catch (error) {
        socket.emit('error', { message: 'Error joining room' });
      }
    });

    // Leave project room
    socket.on('leaveRoom', ({ roomId }) => {
      socket.leave(roomId);
      console.log(`${socket.user.name} left room: ${roomId}`);
    });

    // Handle new message
    socket.on('chatMessage', async ({ roomId, content }) => {
      try {
        const project = await Project.findById(roomId);
        
        if (!project) {
          socket.emit('error', { message: 'Project not found' });
          return;
        }

        // Create and save message
        const message = new Message({
          project: roomId,
          sender: socket.user._id,
          content,
          readBy: [{
            user: socket.user._id,
          }],
        });

        await message.save();
        await message.populate('sender', 'name profilePicture');

        // Broadcast message to room
        io.to(project.chatRoom).emit('newMessage', message);
      } catch (error) {
        socket.emit('error', { message: 'Error sending message' });
      }
    });

    // Handle message read
    socket.on('markAsRead', async ({ roomId, messageId }) => {
      try {
        const message = await Message.findById(messageId);
        
        if (!message) {
          socket.emit('error', { message: 'Message not found' });
          return;
        }

        // Add user to readBy if not already there
        const alreadyRead = message.readBy.some(
          read => read.user.toString() === socket.user._id.toString()
        );

        if (!alreadyRead) {
          message.readBy.push({
            user: socket.user._id,
          });
          await message.save();
        }
      } catch (error) {
        socket.emit('error', { message: 'Error marking message as read' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.name}`);
    });
  });
};

module.exports = {
  setupSocketHandlers,
}; 
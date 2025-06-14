import { io, Socket } from 'socket.io-client';
import { Message } from '../types';

class SocketService {
  private socket: Socket | null = null;
  private messageHandlers: ((message: Message) => void)[] = [];

  connect(token: string) {
    if (this.socket?.connected) return;

    this.socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
      auth: { token },
    });

    this.socket.on('connect', () => {
      console.log('Connected to chat server');
    });

    this.socket.on('newMessage', (message: Message) => {
      this.messageHandlers.forEach(handler => handler(message));
    });

    this.socket.on('error', (error: { message: string }) => {
      console.error('Socket error:', error.message);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from chat server');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(roomId: string) {
    if (this.socket?.connected) {
      this.socket.emit('joinRoom', { roomId });
    }
  }

  leaveRoom(roomId: string) {
    if (this.socket?.connected) {
      this.socket.emit('leaveRoom', { roomId });
    }
  }

  sendMessage(roomId: string, content: string) {
    if (this.socket?.connected) {
      this.socket.emit('chatMessage', { roomId, content });
    }
  }

  onMessage(handler: (message: Message) => void) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }
}

export const socketService = new SocketService(); 
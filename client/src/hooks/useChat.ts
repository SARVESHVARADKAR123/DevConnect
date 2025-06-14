import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001'); // your backend URL

export const useChat = (roomId: string) => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.emit('join', roomId);

    socket.on('message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.emit('leave', roomId);
      socket.off('message');
    };
  }, [roomId]);

  const sendMessage = (text: string) => {
    socket.emit('message', { roomId, text });
  };

  return { messages, sendMessage };
};

import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';

const socket = io('http://localhost:5000'); // Update this as needed

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.emit('joinRoom', { roomId: 'project-123' });

    socket.on('chatMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      socket.emit('chatMessage', { text: input, user: 'Alice' });
      setInput('');
    }
  };

  return (
    <Wrapper>
      <ChatBox>
        <ChatHeader>💬 Project Chat</ChatHeader>
        <MessageArea>
          {messages.map((msg, index) => (
            <ChatMessage key={index}>
              <UserName>{msg.user}:</UserName> <MessageText>{msg.text}</MessageText>
            </ChatMessage>
          ))}
          <div ref={messagesEndRef} />
        </MessageArea>
        <InputForm onSubmit={sendMessage}>
          <ChatInput
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <SendButton type="submit">Send</SendButton>
        </InputForm>
      </ChatBox>
    </Wrapper>
  );
};

export default Chat;

// Styled Components
const Wrapper = styled.div`
  background: linear-gradient(135deg, #0f9b0f, #000000);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const ChatBox = styled.div`
  width: 100%;
  max-width: 800px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  border-radius: 16px;
  padding: 2rem;
  color: white;
  box-shadow: 0 8px 24px rgba(0, 255, 150, 0.2);
`;

const ChatHeader = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  color: #cfffbc;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const MessageArea = styled.div`
  max-height: 350px;
  overflow-y: auto;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 12px;
  margin-bottom: 1rem;
`;

const ChatMessage = styled.div`
  margin-bottom: 0.75rem;
`;

const UserName = styled.span`
  font-weight: bold;
  color: #90ee90;
`;

const MessageText = styled.span`
  color: #e0ffe0;
`;

const InputForm = styled.form`
  display: flex;
  gap: 0.75rem;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 0.85rem 1rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  background: #1d1d1d;
  color: white;

  &::placeholder {
    color: #aaa;
  }
`;

const SendButton = styled.button`
  padding: 0.85rem 1.5rem;
  background: linear-gradient(to right, #00ff87, #60efff);
  color: #003300;
  font-weight: bold;
  font-size: 1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 10px rgba(0, 255, 150, 0.5);
  }
`;

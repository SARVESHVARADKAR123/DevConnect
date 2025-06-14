import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../hooks/useAppSelector.ts';
import { sendMessage, fetchMessages } from '../services/api.ts';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ChatHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ChatTitle = styled.h3`
  margin: 0;
  color: #333;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Message = styled.div<{ isOwn: boolean }>`
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  background: ${props => props.isOwn ? '#007bff' : '#f0f2f5'};
  color: ${props => props.isOwn ? 'white' : '#333'};
  align-self: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
  word-wrap: break-word;
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
`;

const Avatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
`;

const Username = styled.span`
  font-weight: 500;
`;

const Timestamp = styled.span`
  color: #666;
  font-size: 0.75rem;
`;

const InputContainer = styled.div`
  padding: 1rem;
  border-top: 1px solid #eee;
  display: flex;
  gap: 0.5rem;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const SendButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #0056b3;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  background: #ffd7d7;
  border-radius: 4px;
  color: #d93025;
  font-size: 0.875rem;
`;

interface ChatProps {
  projectId: string;
}

const Chat: React.FC<ChatProps> = ({ projectId }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAppSelector((state) => state.auth);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const fetchedMessages = await fetchMessages(projectId);
        setMessages(fetchedMessages);
        setError(null);
      } catch (error) {
        console.error('Error loading messages:', error);
        setError('Failed to load messages. Please try again.');
      }
    };

    loadMessages();
    // Set up polling for new messages
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [projectId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    try {
      const message = await sendMessage({
        projectId,
        content: newMessage.trim()
      });
      setMessages([...messages, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <ChatTitle>Project Chat</ChatTitle>
      </ChatHeader>

      <MessagesContainer>
        {error && (
          <ErrorMessage>{error}</ErrorMessage>
        )}
        {messages.map((message) => (
          <Message key={message._id} isOwn={message.sender._id === user?._id}>
            <MessageHeader>
              <Avatar
                src={message.sender.profilePicture || '/default-avatar.png'}
                alt={message.sender.name}
              />
              <Username>{message.sender.name}</Username>
              <Timestamp>
                {new Date(message.createdAt).toLocaleTimeString()}
              </Timestamp>
            </MessageHeader>
            {message.content}
          </Message>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <form onSubmit={handleSendMessage}>
        <InputContainer>
          <MessageInput
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={isLoading}
          />
          <SendButton type="submit" disabled={isLoading || !newMessage.trim()}>
            {isLoading ? 'Sending...' : 'Send'}
          </SendButton>
        </InputContainer>
      </form>
    </ChatContainer>
  );
};

export default Chat; 
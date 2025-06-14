import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../store';
import { markNotificationAsRead, clearNotifications } from '../features/ui/uiSlice.ts';

const NotificationContainer = styled.div`
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 300px;
`;

const Notification = styled.div<{ type: string }>`
  background: ${({ theme, type }) => theme[type]};
  color: white;
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const Message = styled.span`
  flex: 1;
  margin-right: 1rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.25rem;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const ClearAllButton = styled.button`
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.5rem;
  align-self: flex-end;

  &:hover {
    background: ${({ theme }) => theme.primary}dd;
  }
`;

const NotificationCenter: React.FC = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state: RootState) => state.ui);

  const handleClose = (id: string) => {
    dispatch(markNotificationAsRead(id));
  };

  const handleClearAll = () => {
    dispatch(clearNotifications());
  };

  if (notifications.length === 0) return null;

  return (
    <NotificationContainer>
      {notifications.map((notification) => (
        <Notification key={notification.id} type={notification.type}>
          <Message>{notification.message}</Message>
          <CloseButton onClick={() => handleClose(notification.id)}>
            <i className="fas fa-times" />
          </CloseButton>
        </Notification>
      ))}
      {notifications.length > 1 && (
        <ClearAllButton onClick={handleClearAll}>Clear All</ClearAllButton>
      )}
    </NotificationContainer>
  );
};

export default NotificationCenter; 
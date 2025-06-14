import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${({ theme }) => theme.primary} 0%, ${({ theme }) => theme.secondary} 100%);
`;

const AuthCard = styled.div`
  background: ${({ theme }) => theme.background};
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  margin: 1rem;
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.primary};
`;

const AuthLayout: React.FC = () => {
  return (
    <AuthContainer>
      <AuthCard>
        <Logo>DevConnect</Logo>
        <Outlet />
      </AuthCard>
    </AuthContainer>
  );
};

export default AuthLayout; 
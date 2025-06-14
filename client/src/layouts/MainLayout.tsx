import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Navbar from '../components/Navbar.tsx';
import Sidebar from '../components/Sidebar.tsx';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  margin-left: ${({ theme }) => (theme.sidebarOpen ? '250px' : '0')};
  transition: margin-left 0.3s ease;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
  }
`;

const MainLayout: React.FC = () => {
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);

  return (
    <LayoutContainer>
      <Navbar />
      <Sidebar />
      <MainContent>
        <Outlet />
      </MainContent>
    </LayoutContainer>
  );
};

export default MainLayout; 
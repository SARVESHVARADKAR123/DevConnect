import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../store';

const SidebarContainer = styled.aside<{ isOpen: boolean }>`
  position: fixed;
  top: 64px;
  left: 0;
  bottom: 0;
  width: 250px;
  background: ${({ theme }) => theme.background};
  border-right: 1px solid ${({ theme }) => theme.primary}20;
  transform: translateX(${({ isOpen }) => (isOpen ? '0' : '-100%')});
  transition: transform 0.3s ease;
  z-index: 100;

  @media (max-width: 768px) {
    transform: translateX(-100%);
    ${({ isOpen }) => isOpen && 'transform: translateX(0);'}
  }
`;

const NavList = styled.nav`
  padding: 1rem;
`;

const NavItem = styled(Link)<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: ${({ theme, active }) => (active ? theme.primary : theme.text)};
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.primary}20;
  }

  i {
    width: 20px;
    text-align: center;
  }
`;

const Sidebar: React.FC = () => {
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);
  const location = useLocation();

  const navItems = [
    { path: '/', icon: 'fas fa-home', label: 'Home' },
    { path: '/projects', icon: 'fas fa-code-branch', label: 'Projects' },
    { path: '/create-project', icon: 'fas fa-plus', label: 'Create Project' },
    { path: '/profile', icon: 'fas fa-user', label: 'Profile' },
  ];

  return (
    <SidebarContainer isOpen={sidebarOpen}>
      <NavList>
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            to={item.path}
            active={location.pathname === item.path}
          >
            <i className={item.icon} />
            {item.label}
          </NavItem>
        ))}
      </NavList>
    </SidebarContainer>
  );
};

export default Sidebar; 
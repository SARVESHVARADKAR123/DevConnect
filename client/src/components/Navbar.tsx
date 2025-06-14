import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../store.ts';
import { logout } from '../features/auth/authSlice.ts';
import { toggleTheme, toggleSidebar } from '../features/ui/uiSlice.ts';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: ${({ theme }) => theme.background};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 0 1rem;
  z-index: 1000;
`;

const NavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NavRight = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.primary}20;
  }
`;

const Button = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${({ theme }) => theme.primary}20;
  }
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UserAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const MenuDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${({ theme }) => theme.background};
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  min-width: 200px;
  display: none;

  ${UserMenu}:hover & {
    display: block;
  }
`;

const MenuItem = styled(Link)`
  display: block;
  padding: 0.5rem 1rem;
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  border-radius: 4px;

  &:hover {
    background-color: ${({ theme }) => theme.primary}20;
  }
`;

const MenuButton = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.5rem 1rem;
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  border-radius: 4px;
  border: none;
  background: none;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.primary}20;
  }
`;

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme } = useSelector((state: RootState) => state.ui);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Nav>
      <NavLeft>
        <Button onClick={() => dispatch(toggleSidebar())}>
          <i className="fas fa-bars" />
        </Button>
        <Logo to="/">DevConnect</Logo>
      </NavLeft>

      <NavRight>
        <Button onClick={() => dispatch(toggleTheme())}>
          <i className={`fas fa-${theme.mode === 'light' ? 'moon' : 'sun'}`} />
        </Button>

        {user ? (
          <UserMenu>
            <UserButton>
              <UserAvatar src={user.profilePicture || '/default-avatar.png'} alt={user.name} />
              <span>{user.name}</span>
            </UserButton>
            <MenuDropdown>
              <MenuItem to="/profile">Profile</MenuItem>
              <MenuItem to="/projects">My Projects</MenuItem>
              <MenuItem to="/create-project">Create Project</MenuItem>
              <MenuButton onClick={handleLogout}>
                Logout
              </MenuButton>
            </MenuDropdown>
          </UserMenu>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Register</NavLink>
          </>
        )}
      </NavRight>
    </Nav>
  );
};

export default Navbar;
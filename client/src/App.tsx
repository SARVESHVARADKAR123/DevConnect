import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';
import { RootState } from './store.ts';

// Layouts
import MainLayout from './layouts/MainLayout.tsx';
import AuthLayout from './layouts/AuthLayout.tsx';

// Pages
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';
import Profile from './pages/Profile.tsx';
import Projects from './pages/Projects.tsx';
import ProjectDetails from './pages/ProjectDetails.tsx';
import CreateProject from './pages/CreateProject.tsx';
import NotFound from './pages/NotFound.tsx';

// Components
import ProtectedRoute from './components/ProtectedRoute.tsx';
import NotificationCenter from './components/NotificationCenter.tsx';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
`;

const App: React.FC = () => {
  const { theme } = useSelector((state: RootState) => state.ui);
  const { token } = useSelector((state: RootState) => state.auth);

  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <Router>
          <NotificationCenter />
          <Routes>
            {/* Public Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
              <Route path="/signup" element={!token ? <Signup /> : <Navigate to="/" />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route
                path="/create-project"
                element={
                  <ProtectedRoute>
                    <CreateProject />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AppContainer>
    </ThemeProvider>
  );
};

export default App;

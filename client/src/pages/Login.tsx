import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch.ts';
import { signin } from '../features/auth/authSlice.ts';

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: hidden;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
`;

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await dispatch(signin({ email, password })).unwrap();
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password.');
    }
  };

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <SidePanel>
          <h1>Welcome!</h1>
          <p>Connect with developers worldwide.</p>
        </SidePanel>

        <FormWrapper onSubmit={handleLogin}>
          <h2>Login</h2>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Label>Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <Label>Password</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <Button type="submit">Login</Button>

          <SignupPrompt>
            Don&apos;t have an account? <a href="/signup">Sign up</a>
          </SignupPrompt>
        </FormWrapper>
      </Wrapper>
    </>
  );
};

export default Login;

// Styled Components

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
`;

const SidePanel = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #4caf50, #2e7d32);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;

  h1 {
    font-size: 2.2rem;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1.2rem;
    max-width: 300px;
  }
`;

const FormWrapper = styled.form`
  flex: 1;
  background: ${({ theme }) => theme.background || '#fff'};
  padding: 2rem 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;

  h2 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
`;

const Label = styled.label`
  margin-top: 1.5rem;
  font-size: 1.1rem;
`;

const Input = styled.input`
  padding: 1rem;
  margin-top: 0.5rem;
  font-size: 1.1rem;
  border-radius: 10px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  margin-top: 2rem;
  padding: 1rem;
  font-size: 1.2rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #43a047;
  }
`;

const ErrorMessage = styled.p`
  margin-top: 1rem;
  color: red;
  font-size: 1rem;
  font-weight: bold;
`;

const SignupPrompt = styled.p`
  margin-top: 1.5rem;
  font-size: 1rem;
  text-align: center;

  a {
    color: #4caf50;
    font-weight: bold;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

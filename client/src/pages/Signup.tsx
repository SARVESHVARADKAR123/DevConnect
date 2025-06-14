import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { RootState, AppDispatch } from '../store';
import { signup } from '../features/auth/authSlice.ts';

const GlobalStyle = createGlobalStyle`
  *{
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 0;
  }
`;

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const resultAction = await dispatch(signup({ name, email, password }));
      if (signup.fulfilled.match(resultAction)) {
        navigate('/');
      } else if (signup.rejected.match(resultAction)) {
        setError(resultAction.error.message || 'Signup failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }
  };

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <SidePanel>
          <Logo>DevConnect</Logo>
          <WelcomeContent>
            <Illustration src="/signup-illustration.svg" alt="Signup Illustration" />
            <h1>Join DevConnect!</h1>
            <p>Connect with developers worldwide and start collaborating on amazing projects.</p>
            <Features>
              <Feature>
                <FeatureIcon>👥</FeatureIcon>
                <FeatureText>Connect with developers</FeatureText>
              </Feature>
              <Feature>
                <FeatureIcon>🚀</FeatureIcon>
                <FeatureText>Build amazing projects</FeatureText>
              </Feature>
              <Feature>
                <FeatureIcon>💡</FeatureIcon>
                <FeatureText>Share your ideas</FeatureText>
              </Feature>
            </Features>
          </WelcomeContent>
          <SidePanelFooter>
            <p>&copy; {new Date().getFullYear()} DevConnect. All rights reserved.</p>
          </SidePanelFooter>
        </SidePanel>

        <FormWrapper>
          <FormContent onSubmit={handleSubmit}>
            <FormHeader>
              <h2>Create Account</h2>
              <p>Fill in your details to get started</p>
            </FormHeader>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}

            <SocialLogin>
              <SocialButton><img src="/google-icon.svg" alt="Google" /> Sign up with Google</SocialButton>
              <SocialButton><img src="/github-icon.svg" alt="GitHub" /> Sign up with GitHub</SocialButton>
            </SocialLogin>

            <Divider>OR</Divider>

            <FormGroup>
              <Label>Name</Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Confirm Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </FormGroup>

            <Button type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <LoginPrompt>
              Already have an account? <a href="/login">Login</a>
            </LoginPrompt>
          </FormContent>
        </FormWrapper>
      </Wrapper>
    </>
  );
};

export default Signup;

// Styled Components

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  background: ${({ theme }) => theme.background};
  overflow-x: hidden;

  @media (max-width: 992px) {
    flex-direction: column;
  }
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
  padding: 3rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('/pattern.svg');
    opacity: 0.1;
  }

  @media (max-width: 992px) {
    width: 100%;
    height: 300px;
    padding-bottom: 3rem;
  }

  @media (max-width: 768px) {
    height: 250px;
  }

  @media (max-width: 576px) {
    height: 200px;
  }
`;

const SidePanelFooter = styled.div`
  position: absolute;
  bottom: 2rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;

  @media (max-width: 992px) {
    position: relative;
    bottom: unset;
    margin-top: 1rem;
  }
`;

const Logo = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  position: relative;

  @media (max-width: 992px) {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
`;

const WelcomeContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 400px;
  word-break: break-word;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    font-weight: 700;
  }

  p {
    font-size: 1.2rem;
    line-height: 1.6;
    margin-bottom: 3rem;
    opacity: 0.9;
  }

  @media (max-width: 992px) {
    h1 {
      font-size: 2rem;
    }

    p {
      font-size: 1rem;
      margin-bottom: 1.5rem;
    }

    br {
      display: none;
    }
  }
`;

const Illustration = styled.img`
  width: 150px;
  height: 150px;
  margin-bottom: 2rem;

  @media (max-width: 992px) {
    width: 100px;
    height: 100px;
    margin-bottom: 1rem;
  }
`;

const Features = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;

  @media (max-width: 992px) {
    display: none;
  }
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
`;

const FeatureIcon = styled.div`
  font-size: 1.5rem;
`;

const FeatureText = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
`;

const FormWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.background};
  padding: 2rem;

  @media (max-width: 992px) {
    padding: 1rem;
  }
`;

const FormContent = styled.form`
  background: ${({ theme }) => theme.background};
  padding: 3rem 4rem;
  display: flex;
  flex-direction: column;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  word-break: break-word;

  @media (max-width: 992px) {
    padding: 2rem;
    max-width: 400px;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    max-width: 350px;
  }

  @media (max-width: 576px) {
    padding: 1rem;
    max-width: 100%;
    box-shadow: none;
    border-radius: 0;
  }
`;

const FormHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;

  h2 {
    font-size: 2.2rem;
    margin-bottom: 0.5rem;
    color: ${({ theme }) => theme.text};
  }

  p {
    color: ${({ theme }) => theme.text}99;
    font-size: 1.1rem;
  }

  @media (max-width: 992px) {
    h2 {
      font-size: 1.8rem;
    }

    p {
      font-size: 1rem;
    }
  }
`;

const SocialLogin = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 992px) {
    margin-bottom: 1.5rem;
  }
`;

const SocialButton = styled.button`
  width: 100%;
  padding: 0.8rem 1.5rem;
  min-height: 48px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: ${({ theme }) => theme.background}60;
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.background}80;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background: ${({ theme }) => theme.background};
  }

  img {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 992px) {
    padding: 0.8rem;
    font-size: 0.9rem;
  }
`;

const Divider = styled.div`
  text-align: center;
  margin: 2rem 0;
  color: ${({ theme }) => theme.text}99;
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 40%;
    height: 1px;
    background: ${({ theme }) => theme.text}30;
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }

  @media (max-width: 992px) {
    margin: 1rem 0;
    font-size: 0.9rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};

  @media (max-width: 992px) {
    font-size: 0.9rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  border: 2px solid ${({ theme }) => theme.background}40;
  border-radius: 12px;
  background: ${({ theme }) => theme.background}20;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4caf50;
    background: ${({ theme }) => theme.background};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.primary}20;
  }

  &::placeholder {
    color: ${({ theme }) => theme.text}80;
  }

  @media (max-width: 992px) {
    padding: 0.8rem;
    font-size: 0.9rem;
  }
`;

const Button = styled.button`
  margin-top: 2rem;
  padding: 1rem;
  font-size: 1.1rem;
  background: linear-gradient(135deg, #4caf50, #2e7d32);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 992px) {
    padding: 0.9rem;
    font-size: 1rem;
    margin-top: 1.5rem;
  }
`;

const ErrorMessage = styled.div`
  background: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-align: center;

  &::before {
    content: '⚠️';
  }

  @media (max-width: 992px) {
    font-size: 0.85rem;
    padding: 0.8rem;
  }
`;

const LoginPrompt = styled.p`
  margin-top: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.text}99;
  font-size: 1rem;

  a {
    color: #4caf50;
    font-weight: 600;
    text-decoration: none;
    margin-left: 0.5rem;

    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 992px) {
    font-size: 0.9rem;
    margin-top: 1.5rem;
  }
`;

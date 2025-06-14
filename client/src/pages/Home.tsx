import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Link } from 'react-router-dom';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #f9fafb;
  }
`;

const Home: React.FC = () => (
  <>
    <GlobalStyle />
    <HeroSection>
      <TextBlock>
        <Title>Welcome to DevConnect 👋</Title>
        <Subtitle>Collaborate. Build. Learn.</Subtitle>
        <Description>
          DevConnect helps developers find open-source projects, connect with like-minded devs, and contribute to real-world code.
        </Description>
        <Buttons>
          <StyledLink to="/projects">Browse Projects</StyledLink>
          <StyledLink to="/create-project" secondary>Create a Project</StyledLink>
        </Buttons>
      </TextBlock>
    </HeroSection>

    <FeatureGrid>
      <Feature>
        <h3>🔍 Discover Projects</h3>
        <p>Filter by tech stack, tags, and contribution level.</p>
      </Feature>
      <Feature>
        <h3>💬 Real-Time Chat</h3>
        <p>Talk to project maintainers and fellow contributors instantly.</p>
      </Feature>
      <Feature>
        <h3>🧠 Smart Matching</h3>
        <p>See suggestions based on your skills and interests.</p>
      </Feature>
    </FeatureGrid>
  </>
);

export default Home;

// Styled Components

const HeroSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem 3rem;
  background: linear-gradient(120deg, #4caf50, #2e7d32);
  color: white;
  text-align: center;
`;

const TextBlock = styled.div`
  max-width: 700px;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 400;
  margin-bottom: 1.5rem;
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const StyledLink = styled(Link)<{ secondary?: boolean }>`
  background-color: ${({ secondary }) => (secondary ? '#ffffff33' : 'white')};
  color: ${({ secondary }) => (secondary ? 'white' : '#2e7d32')};
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: bold;
  text-decoration: none;
  transition: 0.3s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2rem;
  padding: 4rem 2rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const Feature = styled.div`
  background: #ffffff;
  border-left: 5px solid #4caf50;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
  }

  h3 {
    margin-bottom: 0.5rem;
    color: #2e7d32;
  }

  p {
    color: #555;
  }
`;

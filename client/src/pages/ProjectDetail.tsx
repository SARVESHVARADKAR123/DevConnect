import React from 'react';
import { useParams } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: hidden;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
`;

const ProjectDetail: React.FC = () => {
  const { id } = useParams();

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <SidePanel>
          <h1>DevConnect</h1>
          <p>Explore and collaborate on open source projects.</p>
        </SidePanel>

        <Main>
          <FormCard>
            <h2>Project Detail</h2>
            <p>Details for project ID: <strong>{id}</strong></p>
          </FormCard>
        </Main>
      </Wrapper>
    </>
  );
};

export default ProjectDetail;

// Styled Components

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
`;

const SidePanel = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #4caf50, #2e7d32);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  text-align: center;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    max-width: 300px;
  }
`;

const Main = styled.div`
  flex: 2;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FormCard = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;

  h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.1rem;
    color: #444;
  }
`;

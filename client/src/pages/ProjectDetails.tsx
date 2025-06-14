import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch.ts';
import { useAppSelector } from '../hooks/useAppSelector.ts';
import {
  fetchProject,
  requestToContribute,
  acceptContributionRequest,
  rejectContributionRequest,
} from '../features/projects/projectSlice.ts';
import styled from 'styled-components';
import Chat from '../components/Chat.tsx';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  margin: 0;
  color: #333;
  font-size: 2rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #0056b3;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled(Button)`
  background: #6c757d;

  &:hover {
    background: #5a6268;
  }
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Sidebar = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Section = styled.section`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  margin: 0 0 1rem;
  color: #333;
  font-size: 1.5rem;
`;

const Description = styled.p`
  margin: 0;
  color: #666;
  line-height: 1.6;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Tag = styled.span`
  padding: 0.25rem 0.75rem;
  background: #e9ecef;
  color: #495057;
  border-radius: 1rem;
  font-size: 0.875rem;
`;

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h3`
  margin: 0;
  color: #333;
  font-size: 1rem;
`;

const UserRole = styled.span`
  color: #666;
  font-size: 0.875rem;
`;

const ChatSection = styled.div`
  margin-top: 2rem;
  height: 500px;
`;

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useAppDispatch();
  const { currentProject: project, loading, error } = useAppSelector((state) => state.projects);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProject(projectId));
    }
  }, [dispatch, projectId]);

  const handleRequestContribution = async () => {
    try {
      await dispatch(requestToContribute(projectId!)).unwrap();
      dispatch(fetchProject(projectId!));
    } catch (err) {
      console.error('Failed to request contribution:', err);
    }
  };

  const handleAcceptContribution = async (userId: string) => {
    try {
      await dispatch(acceptContributionRequest({ projectId: projectId!, userId })).unwrap();
      dispatch(fetchProject(projectId!));
    } catch (err) {
      console.error('Failed to accept contribution:', err);
    }
  };

  const handleRejectContribution = async (userId: string) => {
    try {
      await dispatch(rejectContributionRequest({ projectId: projectId!, userId })).unwrap();
      dispatch(fetchProject(projectId!));
    } catch (err) {
      console.error('Failed to reject contribution:', err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  const isOwner = project.owner._id === user?._id;
  const isContributor = project.contributors.some((c) => c._id === user?._id);
  const hasRequested = project.pendingContributors.some((c) => c._id === user?._id);

  return (
    <Container>
      <Header>
        <Title>{project.title}</Title>
        <Actions>
          {isOwner && (
            <Button as={Link} to={`/projects/${projectId}/edit`}>
              Edit Project
            </Button>
          )}
          {!isOwner && !isContributor && !hasRequested && (
            <Button onClick={handleRequestContribution}>Request to Contribute</Button>
          )}
          {!isOwner && !isContributor && hasRequested && (
            <SecondaryButton disabled>Request Pending</SecondaryButton>
          )}
          {(isOwner || isContributor) && (
            <Button as={Link} to={`/projects/${projectId}/chat`}>
              Open Chat
            </Button>
          )}
        </Actions>
      </Header>

      <Content>
        <MainContent>
          <Section>
            <SectionTitle>Description</SectionTitle>
            <Description>{project.description}</Description>
            <Tags>
              {project.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </Tags>
          </Section>

          {project.repository && (
            <Section>
              <SectionTitle>Repository</SectionTitle>
              <a href={project.repository} target="_blank" rel="noopener noreferrer">
                {project.repository}
              </a>
            </Section>
          )}

          {project.website && (
            <Section>
              <SectionTitle>Website</SectionTitle>
              <a href={project.website} target="_blank" rel="noopener noreferrer">
                {project.website}
              </a>
            </Section>
          )}
        </MainContent>

        <Sidebar>
          <Section>
            <SectionTitle>Owner</SectionTitle>
            <UserItem>
              <Avatar
                src={project.owner.profilePicture || '/default-avatar.png'}
                alt={project.owner.name}
              />
              <UserInfo>
                <UserName>{project.owner.name}</UserName>
                <UserRole>Owner</UserRole>
              </UserInfo>
            </UserItem>
          </Section>

          <Section>
            <SectionTitle>Contributors</SectionTitle>
            <UserList>
              {project.contributors.map((contributor) => (
                <UserItem key={contributor._id}>
                  <Avatar
                    src={contributor.profilePicture || '/default-avatar.png'}
                    alt={contributor.name}
                  />
                  <UserInfo>
                    <UserName>{contributor.name}</UserName>
                    <UserRole>Contributor</UserRole>
                  </UserInfo>
                </UserItem>
              ))}
            </UserList>
          </Section>

          {isOwner && project.pendingContributors.length > 0 && (
            <Section>
              <SectionTitle>Pending Requests</SectionTitle>
              <UserList>
                {project.pendingContributors.map((contributor) => (
                  <UserItem key={contributor._id}>
                    <Avatar
                      src={contributor.profilePicture || '/default-avatar.png'}
                      alt={contributor.name}
                    />
                    <UserInfo>
                      <UserName>{contributor.name}</UserName>
                      <UserRole>Pending</UserRole>
                    </UserInfo>
                    <Actions>
                      <Button onClick={() => handleAcceptContribution(contributor._id)}>
                        Accept
                      </Button>
                      <SecondaryButton onClick={() => handleRejectContribution(contributor._id)}>
                        Reject
                      </SecondaryButton>
                    </Actions>
                  </UserItem>
                ))}
              </UserList>
            </Section>
          )}
        </Sidebar>
      </Content>

      <ChatSection>
        <SectionTitle>Project Chat</SectionTitle>
        <Chat projectId={projectId!} />
      </ChatSection>
    </Container>
  );
};

export default ProjectDetails; 
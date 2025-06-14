import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch.ts';
import { useAppSelector } from '../hooks/useAppSelector.ts';
import { fetchProjects } from '../features/projects/projectSlice.ts';
import styled from 'styled-components';

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

const Button = styled(Link)`
  padding: 0.75rem 1.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background: #0056b3;
  }
`;

const Filters = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const TagFilter = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  background: ${props => props.active ? '#007bff' : '#e9ecef'};
  color: ${props => props.active ? 'white' : '#495057'};
  border: none;
  border-radius: 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? '#0056b3' : '#dee2e6'};
  }
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const ProjectCard = styled(Link)`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const ProjectImage = styled.div`
  height: 200px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  font-size: 1.5rem;
`;

const ProjectContent = styled.div`
  padding: 1.5rem;
`;

const ProjectTitle = styled.h2`
  margin: 0 0 0.5rem;
  color: #333;
  font-size: 1.25rem;
`;

const ProjectDescription = styled.p`
  margin: 0 0 1rem;
  color: #666;
  font-size: 0.875rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProjectTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ProjectTag = styled.span`
  padding: 0.25rem 0.75rem;
  background: #e9ecef;
  color: #495057;
  border-radius: 1rem;
  font-size: 0.75rem;
`;

const ProjectMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
`;

const OwnerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const OwnerAvatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
`;

const OwnerName = styled.span`
  color: #666;
  font-size: 0.875rem;
`;

const ContributorCount = styled.span`
  color: #666;
  font-size: 0.875rem;
`;

const Projects: React.FC = () => {
  const dispatch = useAppDispatch();
  const { projects, loading, error } = useAppSelector((state) => state.projects);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchProjects({ tags: selectedTags }));
  }, [dispatch, selectedTags]);

  const allTags = Array.from(
    new Set(projects.flatMap((project) => project.tags))
  ).sort();

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container>
      <Header>
        <Title>Projects</Title>
        <Button to="/projects/create">Create Project</Button>
      </Header>

      <Filters>
        {allTags.map((tag: string) => (
          <TagFilter
            key={tag}
            active={selectedTags.includes(tag)}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </TagFilter>
        ))}
      </Filters>

      <ProjectGrid>
        {projects.map((project) => (
          <ProjectCard key={project._id} to={`/projects/${project._id}`}>
            <ProjectImage>
              {project.title.charAt(0).toUpperCase()}
            </ProjectImage>
            <ProjectContent>
              <ProjectTitle>{project.title}</ProjectTitle>
              <ProjectDescription>{project.description}</ProjectDescription>
              <ProjectTags>
                {project.tags.map((tag: string) => (
                  <ProjectTag key={tag}>{tag}</ProjectTag>
                ))}
              </ProjectTags>
              <ProjectMeta>
                <OwnerInfo>
                  <OwnerAvatar
                    src={project.owner.profilePicture || '/default-avatar.png'}
                    alt={project.owner.name}
                  />
                  <OwnerName>{project.owner.name}</OwnerName>
                </OwnerInfo>
                <ContributorCount>
                  {project.contributors.length} contributor
                  {project.contributors.length !== 1 ? 's' : ''}
                </ContributorCount>
              </ProjectMeta>
            </ProjectContent>
          </ProjectCard>
        ))}
      </ProjectGrid>
    </Container>
  );
};

export default Projects;

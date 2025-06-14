import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch.ts';
import { createProject } from '../features/projects/projectSlice.ts';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Title = styled.h1`
  margin: 0 0 2rem;
  color: #333;
  font-size: 2rem;
`;

const Form = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const TagInputContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 42px;

  &:focus-within {
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const RemoveTag = styled.button`
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0;
  font-size: 1rem;
  line-height: 1;

  &:hover {
    color: #343a40;
  }
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  background: #e9ecef;
  color: #495057;
  border-radius: 1rem;
  font-size: 0.875rem;
  gap: 0.5rem;

  button {
    background: none;
    border: none;
    color: #6c757d;
    cursor: pointer;
    padding: 0;
    font-size: 1rem;
    line-height: 1;

    &:hover {
      color: #343a40;
    }
  }
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

const ErrorMessage = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const CreateProject: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [repository, setRepository] = useState('');
  const [website, setWebsite] = useState('');
  const [category, setCategory] = useState('other');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!title.trim()) {
        throw new Error('Title is required');
      }
      if (!description.trim()) {
        throw new Error('Description is required');
      }

      console.log('Submitting project data:', {
        title,
        description,
        tags,
        category,
        repository: repository || undefined,
        website: website || undefined
      });

      const result = await dispatch(createProject({
        title,
        description,
        tags,
        category,
        repository: repository || undefined,
        website: website || undefined,
        _id: '',
        pendingContributors: []
      })).unwrap();

      console.log('Project created successfully:', result);
      navigate('/projects');
    } catch (err: any) {
      console.error('Project creation error:', err);
      let errorMessage = 'Failed to create project. Please try again.';
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.details && Array.isArray(err.details)) {
        errorMessage = err.details.join(', ');
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Title>Create New Project</Title>
      <Form onSubmit={handleSubmit}>
        {error && (
          <ErrorMessage>
            {error}
          </ErrorMessage>
        )}

        <FormGroup>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter project title"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">Description *</Label>
          <TextArea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your project"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="category">Category *</Label>
          <Select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="web">Web Development</option>
            <option value="mobile">Mobile Development</option>
            <option value="desktop">Desktop Development</option>
            <option value="ai">AI/ML</option>
            <option value="game">Game Development</option>
            <option value="other">Other</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="tags">Tags</Label>
          <TagInputContainer>
            <Input
              type="text"
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Add tags (press Enter)"
            />
            <TagList>
              {tags.map((tag, index) => (
                <Tag key={index}>
                  {tag}
                  <RemoveTag onClick={() => removeTag(tag)}>&times;</RemoveTag>
                </Tag>
              ))}
            </TagList>
          </TagInputContainer>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="repository">Repository URL</Label>
          <Input
            id="repository"
            type="url"
            value={repository}
            onChange={(e) => setRepository(e.target.value)}
            placeholder="https://github.com/username/repo"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="website">Website URL</Label>
          <Input
            id="website"
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://your-project.com"
          />
        </FormGroup>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Project'}
        </Button>
      </Form>
    </Container>
  );
};

export default CreateProject;

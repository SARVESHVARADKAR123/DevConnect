import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch.ts';
import { useAppSelector } from '../hooks/useAppSelector.ts';
import { fetchCurrentUser } from '../features/auth/authSlice.ts';
import styled from 'styled-components';

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    github: '',
    linkedin: '',
    website: '',
    skills: [] as string[],
    profilePicture: '',
  });
  const [newSkill, setNewSkill] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        github: user.githubLink || '',
        linkedin: user.linkedin || '',
        website: user.website || '',
        skills: user.skills || [],
        profilePicture: user.profilePicture || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update profile');
      }

      setSuccess('Profile updated successfully');
      dispatch(fetchCurrentUser());
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    }
  };

  const handleSkillInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(newSkill.trim())) {
        setFormData({
          ...formData,
          skills: [...formData.skills, newSkill.trim()],
        });
      }
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>Profile</Title>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <ProfilePictureSection>
          <ProfilePicture
            src={formData.profilePicture || '/default-avatar.png'}
            alt="Profile"
          />
          <FormGroup>
            <Label htmlFor="profilePicture">Profile Picture URL</Label>
            <Input
              type="url"
              id="profilePicture"
              value={formData.profilePicture}
              onChange={(e) => setFormData({ ...formData, profilePicture: e.target.value })}
              placeholder="Enter image URL"
            />
          </FormGroup>
        </ProfilePictureSection>

        <FormGroup>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="bio">Bio</Label>
          <TextArea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Tell us about yourself..."
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="github">GitHub Profile</Label>
          <Input
            type="url"
            id="github"
            value={formData.github}
            onChange={(e) => setFormData({ ...formData, github: e.target.value })}
            placeholder="https://github.com/yourusername"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="linkedin">LinkedIn Profile</Label>
          <Input
            type="url"
            id="linkedin"
            value={formData.linkedin}
            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
            placeholder="https://linkedin.com/in/yourusername"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="website">Personal Website</Label>
          <Input
            type="url"
            id="website"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://yourwebsite.com"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="skills">Skills</Label>
          <Input
            type="text"
            id="skills"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={handleSkillInputKeyDown}
            placeholder="Type a skill and press Enter"
          />
          <SkillsList>
            {formData.skills.map((skill) => (
              <SkillTag key={skill}>
                {skill}
                <RemoveButton onClick={() => removeSkill(skill)}>&times;</RemoveButton>
              </SkillTag>
            ))}
          </SkillsList>
        </FormGroup>

        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Form>
    </Container>
  );
};

export default Profile;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f9b0f, #000000);
  padding: 2rem;
`;

const Form = styled.form`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 8px 24px rgba(0, 255, 150, 0.2);
`;

const Title = styled.h1`
  color: #cfffbc;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
`;

const ProfilePictureSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ProfilePicture = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #00ff87;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  color: #90ee90;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.85rem 1rem;
  border: none;
  border-radius: 10px;
  background: #1d1d1d;
  color: white;
  font-size: 1rem;

  &:focus {
    outline: 2px solid #00ff87;
  }
`;

const TextArea = styled.textarea`
  padding: 0.85rem 1rem;
  border: none;
  border-radius: 10px;
  background: #1d1d1d;
  color: white;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: 2px solid #00ff87;
  }
`;

const Button = styled.button`
  padding: 1rem;
  background: linear-gradient(to right, #00ff87, #60efff);
  color: #003300;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s ease;
  width: 100%;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 0 10px rgba(0, 255, 150, 0.5);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SkillsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const SkillTag = styled.span`
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  color: #90ee90;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ff6b6b;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #ff4444;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  padding: 0.75rem;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.div`
  color: #00ff87;
  background: rgba(0, 255, 135, 0.1);
  padding: 0.75rem;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 1rem;
`;
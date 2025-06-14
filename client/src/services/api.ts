import axios from 'axios';
import { User, Project, Message } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('API Request - Token present:', !!token);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error('API Request Error:', error);
  return Promise.reject(error);
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    if (error.response?.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Auth API
export const register = async (userData: {
  name: string;
  email: string;
  password: string;
}): Promise<{ token: string; user: User }> => {
  try {
    const response = await api.post('/api/auth/signup', userData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(error.response.data.message || error.response.data.error || 'Registration failed');
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error('Error setting up request');
    }
  }
};

export const login = async (credentials: {
  email: string;
  password: string;
}): Promise<{ token: string; user: User }> => {
  const response = await api.post('/api/auth/login', credentials);
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get('/api/auth/me');
  return response.data;
};

// Projects API
export const fetchProjects = async (params?: {
  tags?: string[];
}): Promise<Project[]> => {
  const response = await api.get('/api/projects', { params });
  return response.data;
};

export const fetchProjectById = async (projectId: string): Promise<Project> => {
  const response = await api.get(`/api/projects/${projectId}`);
  return response.data;
};

export const createProject = async (projectData: {
  title: string;
  description: string;
  tags: string[];
  category: string;
  repository?: string;
  website?: string;
}): Promise<Project> => {
  try {
    console.log('Creating project with data:', projectData);
    const response = await api.post('/api/projects', projectData);
    console.log('Project created successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Project creation error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    if (error.response?.data?.details) {
      throw new Error(error.response.data.details.join(', '));
    }
    throw new Error(error.response?.data?.message || 'Failed to create project');
  }
};

export const requestToContribute = async (projectId: string): Promise<void> => {
  await api.post(`/api/projects/${projectId}/contribute`);
};

export const acceptContributionRequest = async ({
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
}): Promise<void> => {
  await api.post(`/api/projects/${projectId}/contributors/${userId}/accept`);
};

export const rejectContributionRequest = async ({
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
}): Promise<void> => {
  await api.post(`/api/projects/${projectId}/contributors/${userId}/reject`);
};

// Chat API
export const fetchMessages = async (projectId: string): Promise<Message[]> => {
  const response = await api.get(`/api/messages/${projectId}`);
  return response.data;
};

export const sendMessage = async (data: { projectId: string; content: string }): Promise<Message> => {
  const response = await api.post('/api/messages', data);
  return response.data;
};

export const markMessageAsRead = async (messageId: string): Promise<void> => {
  await api.post(`/api/chat/messages/${messageId}/read`);
};

export default api; 
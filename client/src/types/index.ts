export interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  skills?: string[];
  github?: string;
  linkedin?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  repository?: string;
  website?: string;
  owner: User;
  contributors: User[];
  pendingContributors: User[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  project: string;
  sender: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  content: string;
  type: 'text' | 'system';
  readBy: string[];
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
}

export interface ChatState {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  projects: ProjectState;
  chat: ChatState;
} 
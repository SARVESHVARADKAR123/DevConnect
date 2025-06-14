// client/src/features/projects/projectSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  profilePicture?: string;
}



interface Project {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  owner: User;
  contributors: User[];
  pendingContributors: User[];
  repository?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
  category:string
  
}

interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
};

export interface CreateProjectPayload {
  title: string;
  description: string;
  tags: string[];
  category: string;
  repository?: string;
  website?: string;
}



export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (filters?: { tags?: string[] }) => {
    const response = await axios.get('/api/projects', { params: filters });
    return response.data;
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData: Omit<Project, 'id' | 'owner' | 'contributors' | 'createdAt' | 'updatedAt'>) => {
    const response = await axios.post('/api/projects', projectData);
    return response.data;
  }
);

export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (projectId: string) => {
    const response = await axios.get(`/api/projects/${projectId}`);
    return response.data;
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ projectId, data }: { projectId: string; data: Partial<Project> }) => {
    const response = await axios.put(`/api/projects/${projectId}`, data);
    return response.data;
  }
);

export const inviteContributor = createAsyncThunk(
  'projects/inviteContributor',
  async ({ projectId, email }: { projectId: string; email: string }) => {
    const response = await axios.post(`/api/projects/${projectId}/invite`, { email });
    return response.data;
  }
);

export const fetchProject = createAsyncThunk(
  'projects/fetchProject',
  async (projectId: string) => {
    const response = await axios.get(`/api/projects/${projectId}`);
    return response.data;
  }
);

export const requestToContribute = createAsyncThunk(
  'projects/requestToContribute',
  async (projectId: string) => {
    const response = await axios.post(`/api/projects/${projectId}/request`);
    return response.data;
  }
);

export const acceptContributionRequest = createAsyncThunk(
  'projects/acceptContributionRequest',
  async ({ projectId, userId }: { projectId: string; userId: string }) => {
    const response = await axios.post(`/api/projects/${projectId}/accept/${userId}`);
    return response.data;
  }
);

export const rejectContributionRequest = createAsyncThunk(
  'projects/rejectContributionRequest',
  async ({ projectId, userId }: { projectId: string; userId: string }) => {
    const response = await axios.post(`/api/projects/${projectId}/reject/${userId}`);
    return response.data;
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch projects';
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.currentProject = action.payload;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.currentProject?._id === action.payload._id) {
          state.currentProject = action.payload;
        }
      })
      .addCase(fetchProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch project';
      })
      .addCase(requestToContribute.fulfilled, (state, action) => {
        if (state.currentProject) {
          state.currentProject.pendingContributors.push(action.payload);
        }
      })
      .addCase(acceptContributionRequest.fulfilled, (state, action) => {
        if (state.currentProject) {
          state.currentProject.contributors.push(action.payload);
          state.currentProject.pendingContributors = state.currentProject.pendingContributors.filter(
            user => user._id !== action.payload._id
          );
        }
      })
      .addCase(rejectContributionRequest.fulfilled, (state, action) => {
        if (state.currentProject) {
          state.currentProject.pendingContributors = state.currentProject.pendingContributors.filter(
            user => user._id !== action.payload._id
          );
        }
      });
  },
});

export const { clearCurrentProject, clearError } = projectSlice.actions;
export default projectSlice.reducer;
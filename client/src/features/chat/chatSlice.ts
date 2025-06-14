import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    profilePicture?: string;
  };
  projectId: string;
  createdAt: string;
}

interface ChatState {
  messages: Message[];
  loading: boolean;
  error: string | null;
  connected: boolean;
}

const initialState: ChatState = {
  messages: [],
  loading: false,
  error: null,
  connected: false,
};

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (projectId: string) => {
    const response = await axios.get(`/api/chat/${projectId}/messages`);
    return response.data;
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ projectId, content }: { projectId: string; content: string }) => {
    const response = await axios.post(`/api/chat/${projectId}/messages`, { content });
    return response.data;
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConnected: (state, action) => {
      state.connected = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch messages';
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      });
  },
});

export const { setConnected, addMessage, clearMessages, clearError } = chatSlice.actions;
export default chatSlice.reducer; 
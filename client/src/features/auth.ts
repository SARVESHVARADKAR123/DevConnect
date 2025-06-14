import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const signup = createAsyncThunk('auth/signup', async (userData) => {
  const res = await axios.post('/api/signup', userData);
  localStorage.setItem('token', res.data.token);
  return res.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signup.fulfilled, (state, action) => {
      state.user = action.payload.user;
    });
  },
});

export default authSlice.reducer;

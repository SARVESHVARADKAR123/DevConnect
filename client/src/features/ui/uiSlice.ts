import { createSlice } from '@reduxjs/toolkit';

interface Theme {
  mode: 'light' | 'dark';
  primary: string;
  secondary: string;
  background: string;
  text: string;
  error: string;
  success: string;
  warning: string;
  accent: string;
  sidebarOpen: boolean;
}

const lightTheme: Theme = {
  mode: 'light',
  primary: '#4caf50',    // Green
  secondary: '#2e7d32',  // Dark Green
  background: '#ffffff',
  text: '#1f2937',
  error: '#ef4444',
  success: '#22c55e',
  warning: '#f59e0b',
  accent: '#81c784',     // Light Green
  sidebarOpen: false,
};

const darkTheme: Theme = {
  mode: 'dark',
  primary: '#66bb6a',    // Light Green
  secondary: '#43a047',  // Green
  background: '#1f2937',
  text: '#f3f4f6',
  error: '#f87171',
  success: '#4ade80',
  warning: '#fbbf24',
  accent: '#a5d6a7',     // Very Light Green
  sidebarOpen: false,
};

interface UIState {
  theme: Theme;
  sidebarOpen: boolean;
  notifications: Array<{
    id: string;
    type: 'info' | 'success' | 'error' | 'warning';
    message: string;
    read: boolean;
  }>;
}

const initialState: UIState = {
  theme: lightTheme,
  sidebarOpen: false,
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme.mode === 'light' ? darkTheme : lightTheme;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now().toString(),
        ...action.payload,
        read: false,
      });
    },
    markNotificationAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  toggleSidebar,
  addNotification,
  markNotificationAsRead,
  clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer; 
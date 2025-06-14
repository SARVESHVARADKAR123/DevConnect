import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice.ts';
import projectReducer from './features/projects/projectSlice.ts';
import chatReducer from './features/chat/chatSlice.ts';
import uiReducer from './features/ui/uiSlice.ts';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    chat: chatReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
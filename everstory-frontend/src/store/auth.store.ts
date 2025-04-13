import { create } from 'zustand';
import { authService, User } from '../services/auth.service';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (data: { username: string; email: string; password: string; fullName: string }) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (username, password) => {
    try {
      set({ isLoading: true, error: null });
      console.log('Attempting login with:', { username, password });
      const response = await authService.login({ username, password });
      console.log('Login successful, setting user data');
      
      set({ 
        user: response.user, 
        isAuthenticated: true, 
        isLoading: false, 
        error: null 
      });
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during login';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  signup: async (data) => {
    try {
      set({ isLoading: true, error: null });
      console.log('Attempting signup with:', data);
      const response = await authService.signup(data);
      console.log('Signup successful, setting token and user');
      authService.setToken(response.token);
      set({ user: response.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.error('Signup error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Signup failed', 
        isLoading: false 
      });
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    try {
      if (authService.isAuthenticated()) {
        const user = await authService.getCurrentUser();
        set({ user, isAuthenticated: true });
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false });
    }
  },
})); 
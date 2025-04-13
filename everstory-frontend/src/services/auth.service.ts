import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  profilePicture?: string;
  bio?: string;
}

export const authService = {
  async login(credentials: LoginCredentials) {
    try {
      console.log('Sending login request with:', credentials);
      const formData = new URLSearchParams();
      formData.append('username', credentials.username.trim());
      formData.append('password', credentials.password);

      const response = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      console.log('Login response:', response.data);
      
      // Set the token in localStorage and axios headers
      if (response.data.access_token) {
        this.setToken(response.data.access_token);
        // Get user data immediately after setting token
        const user = await this.getCurrentUser();
        return {
          token: response.data.access_token,
          token_type: response.data.token_type,
          user
        };
      }
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Login error details:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
        });
        
        // Handle validation errors
        if (error.response?.status === 422) {
          const validationErrors = error.response.data?.errors || {};
          const errorMessages = Object.entries(validationErrors)
            .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
            .join('\n');
          throw new Error(errorMessages || 'Invalid credentials');
        }
        
        // Handle other errors
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.detail || 
                           'Login failed';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  async signup(data: SignupData) {
    try {
      console.log('Sending signup request with:', data);
      const response = await axios.post(`${API_URL}/auth/register`, {
        username: data.username.trim(),
        email: data.email.trim(),
        password: data.password,
        fullName: data.fullName.trim(),
      });
      console.log('Signup response:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Signup error details:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
        });
        throw new Error(error.response?.data?.message || 'Signup failed');
      }
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No token available');
      }
      
      const response = await api.get('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  },

  setToken(token: string) {
    localStorage.setItem('token', token);
    // Update axios default headers
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    return !!this.getToken();
  },
}; 
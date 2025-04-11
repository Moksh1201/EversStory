import axios from 'axios';
import { LoginCredentials, RegisterCredentials, User } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const authApi = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (credentials: LoginCredentials) => {
  const response = await authApi.post<{ user: User; token: string }>('/login', credentials);
  return response.data;
};

export const register = async (credentials: RegisterCredentials) => {
  const response = await authApi.post<{ user: User; token: string }>('/register', credentials);
  return response.data;
};

export const getCurrentUser = async (token: string) => {
  const response = await authApi.get<{ user: User }>('/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.user;
}; 
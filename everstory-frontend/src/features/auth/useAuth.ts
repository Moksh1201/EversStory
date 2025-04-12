import { create } from "zustand";
import jwtDecode from "jwt-decode";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
  setUserFromToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null });
  },
  setUserFromToken: () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode<User & { exp: number }>(token);
      set({ user: decoded });
    }
  }
}));

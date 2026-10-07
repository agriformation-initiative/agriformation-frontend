import { create } from 'zustand';
import { User } from '@/types/indexes';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  /** True once localStorage has been read. Guards must wait for this before redirecting. */
  hydrated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  hydrated: false,

  setAuth: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true, hydrated: true });
  },

  clearAuth: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false, hydrated: true });
  },

  initAuth: () => {
    if (get().hydrated) return;
    try {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (user && token) {
        set({ user: JSON.parse(user), token, isAuthenticated: true, hydrated: true });
        return;
      }
    } catch {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    set({ hydrated: true });
  },
}));

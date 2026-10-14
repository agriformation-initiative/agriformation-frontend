import api from '@/lib/auth';
import { AuthResponse, ApiResponse, User } from '@/types/indexes';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  async register(data: {
    fullName: string;
    email: string;
    password: string;
    phoneNumber?: string;
  }): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  async getMe(): Promise<ApiResponse<{ user: User }>> {
    const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
    return response.data;
  },

  async forgotPassword(email: string) {
    await api.post('/auth/forgot-password', { email });
  },

  async resetPassword(token: string, password: string) {
    await api.post('/auth/reset-password', { token, password });
  },

  async changePassword(currentPassword: string, newPassword: string) {
    await api.put('/auth/change-password', { currentPassword, newPassword });
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

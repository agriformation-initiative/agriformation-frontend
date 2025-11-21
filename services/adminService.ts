import api from '@/lib/auth';
import {
  ApiResponse,
  PaginatedResponse,
  VolunteerApplication,
  Volunteer,
  DashboardStats,
  User,
} from '@/types/indexes';

export const adminService = {
  // Applications
  async getApplications(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<VolunteerApplication>> {
    const response = await api.get('/admin/applications', { params });
    return response.data;
  },

  async reviewApplication(
    id: string,
    data: { status: 'accepted' | 'rejected'; notes?: string }
  ): Promise<ApiResponse<{ application: VolunteerApplication }>> {
    const response = await api.put(`/admin/applications/${id}/review`, data);
    return response.data;
  },

  // Volunteers
  async getAllVolunteers(params?: {
    status?: string;
    role?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Volunteer>> {
    const response = await api.get('/admin/volunteers', { params });
    return response.data;
  },

  async getVolunteerDetails(id: string): Promise<ApiResponse<{ volunteer: Volunteer }>> {
    const response = await api.get(`/admin/volunteers/${id}`);
    return response.data;
  },

  async updateVolunteerStatus(
    id: string,
    data: { status: string; notes?: string }
  ): Promise<ApiResponse<{ volunteer: Volunteer }>> {
    const response = await api.put(`/admin/volunteers/${id}/status`, data);
    return response.data;
  },

  async assignToProgram(
    id: string,
    data: {
      programName: string;
      role: string;
      startDate: string;
      endDate?: string;
    }
  ): Promise<ApiResponse<{ volunteer: Volunteer }>> {
    const response = await api.post(`/admin/volunteers/${id}/assign`, data);
    return response.data;
  },

  // Dashboard
  async getDashboardStats(): Promise<
    ApiResponse<{
      stats: DashboardStats;
      recentApplications: VolunteerApplication[];
    }>
  > {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  // Superadmin only
  async getAllUsers(params?: {
    role?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<User>> {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  async createAdmin(data: {
    fullName: string;
    email: string;
    password: string;
    phoneNumber?: string;
  }): Promise<ApiResponse<{ user: User }>> {
    const response = await api.post('/admin/users/create-admin', data);
    return response.data;
  },

  async updateUserRole(
    id: string,
    role: string
  ): Promise<ApiResponse<{ user: User }>> {
    const response = await api.put(`/admin/users/${id}/role`, { role });
    return response.data;
  },

  async toggleUserStatus(id: string): Promise<ApiResponse<{ user: User }>> {
    const response = await api.put(`/admin/users/${id}/toggle-status`);
    return response.data;
  },
};
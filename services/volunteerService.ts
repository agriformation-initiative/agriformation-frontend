import api from '@/lib/auth';
import { ApiResponse, Volunteer, VolunteerApplication } from '@/types/indexes';

export const volunteerService = {
  async submitApplication(data: {
    fullName: string;
    email: string;
    preferredRole: string;
    aboutYourself: string;
  }): Promise<ApiResponse<{ application: VolunteerApplication }>> {
    const response = await api.post('/volunteers/apply', data);
    return response.data;
  },

  async getProfile(): Promise<ApiResponse<{ volunteer: Volunteer }>> {
    const response = await api.get('/volunteers/profile');
    return response.data;
  },

  async updateProfile(data: Partial<Volunteer>): Promise<ApiResponse<{ volunteer: Volunteer }>> {
    const response = await api.put('/volunteers/profile', data);
    return response.data;
  },
};

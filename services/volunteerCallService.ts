// services/volunteerCallService.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const volunteerCallService = {
  // Admin endpoints
  async getAllVolunteerCalls(params?: { status?: string; category?: string; page?: number }) {
    const token = localStorage.getItem('token');
    const queryParams = new URLSearchParams();
    
    if (params?.status) queryParams.append('status', params.status);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.page) queryParams.append('page', params.page.toString());

    const response = await fetch(
      `${API_URL}/admin/volunteer-calls?${queryParams.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    return response.json();
  },

  async getVolunteerCallDetails(id: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/volunteer-calls/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.json();
  },

  async createVolunteerCall(formData: FormData) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/volunteer-calls`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    return response.json();
  },

  async updateVolunteerCall(id: string, formData: FormData) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/volunteer-calls/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    return response.json();
  },

  async togglePublishStatus(id: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/volunteer-calls/${id}/publish`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.json();
  },

  async updateStatus(id: string, status: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/volunteer-calls/${id}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    return response.json();
  },

  async updateApplicationStatus(callId: string, applicationId: string, status: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_URL}/admin/volunteer-calls/${callId}/applications/${applicationId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      }
    );

    return response.json();
  },

  async deleteVolunteerCall(id: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/volunteer-calls/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.json();
  },

  async getVolunteerCallStats() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/volunteer-calls/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.json();
  },

  // Public endpoints
  async getPublishedVolunteerCalls(params?: { category?: string; page?: number }) {
    const queryParams = new URLSearchParams();
    
    if (params?.category) queryParams.append('category', params.category);
    if (params?.page) queryParams.append('page', params.page.toString());

    const response = await fetch(
      `${API_URL}/volunteer-calls?${queryParams.toString()}`
    );

    return response.json();
  },

  async getPublicVolunteerCall(id: string) {
    const response = await fetch(`${API_URL}/volunteer-calls/${id}`);
    return response.json();
  },

  async applyForVolunteer(id: string, applicationData: any) {
    const token = localStorage.getItem('token');
    const headers: any = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/volunteer-calls/${id}/apply`, {
      method: 'POST',
      headers,
      body: JSON.stringify(applicationData),
    });

    return response.json();
  },
};
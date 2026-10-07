import api from '@/lib/auth';

export interface CallApplication {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
}

export interface AdminVolunteerCall {
  _id: string;
  title: string;
  description: string;
  requirements: string;
  designImage: { url: string; publicId?: string };
  eventDate: string;
  location: string;
  numberOfVolunteers: number;
  deadline: string;
  category: string;
  status: 'draft' | 'open' | 'closed' | 'cancelled';
  isPublished: boolean;
  applications: CallApplication[];
  viewCount: number;
  createdAt: string;
}

export const CALL_CATEGORIES = [
  { value: 'farm_work', label: 'Farm work' },
  { value: 'event_support', label: 'Event support' },
  { value: 'community_outreach', label: 'Community outreach' },
  { value: 'training', label: 'Training' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'other', label: 'Other' },
];

const multipart = { headers: { 'Content-Type': 'multipart/form-data' } };

/** Admin endpoints. Errors throw (axios), so callers handle them with try/catch. */
export const volunteerCallService = {
  async list(params: { status?: string; category?: string; page?: number } = {}) {
    const res = await api.get('/admin/volunteer-calls', { params: { limit: 50, ...params } });
    return res.data.data.calls as AdminVolunteerCall[];
  },

  async get(id: string) {
    const res = await api.get(`/admin/volunteer-calls/${id}`);
    return res.data.data.call as AdminVolunteerCall;
  },

  async create(form: FormData) {
    const res = await api.post('/admin/volunteer-calls', form, multipart);
    return res.data.data.call as AdminVolunteerCall;
  },

  async update(id: string, form: FormData) {
    const res = await api.put(`/admin/volunteer-calls/${id}`, form, multipart);
    return res.data.data.call as AdminVolunteerCall;
  },

  async togglePublish(id: string) {
    const res = await api.put(`/admin/volunteer-calls/${id}/publish`);
    return res.data.data.call as AdminVolunteerCall;
  },

  async updateStatus(id: string, status: string) {
    const res = await api.put(`/admin/volunteer-calls/${id}/status`, { status });
    return res.data.data.call as AdminVolunteerCall;
  },

  async updateApplicationStatus(callId: string, applicationId: string, status: string) {
    const res = await api.put(`/admin/volunteer-calls/${callId}/applications/${applicationId}`, { status });
    return res.data.data.call as AdminVolunteerCall;
  },

  async remove(id: string) {
    await api.delete(`/admin/volunteer-calls/${id}`);
  },
};

import api from '@/lib/auth';

export type InquiryType = 'contact' | 'school' | 'partner';

export interface InquiryInput {
  type: InquiryType;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  location?: string;
  studentCount?: string;
  subject?: string;
  message: string;
  /** Honeypot. Must stay empty. */
  website?: string;
}

export interface AdminInquiry extends Omit<InquiryInput, 'website'> {
  _id: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt: string;
}

export const inquiryService = {
  async send(input: InquiryInput) {
    await api.post('/inquiries', input);
  },

  async list(params: { type?: InquiryType; status?: string } = {}) {
    const res = await api.get('/admin/inquiries', { params });
    return res.data.data.inquiries as AdminInquiry[];
  },

  async updateStatus(id: string, status: AdminInquiry['status']) {
    const res = await api.put(`/admin/inquiries/${id}/status`, { status });
    return res.data.data.inquiry as AdminInquiry;
  },
};

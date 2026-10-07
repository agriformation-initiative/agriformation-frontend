import api from '@/lib/auth';

export interface AdminBlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: { url: string };
  contentImages: Array<{ _id: string; url: string; caption?: string }>;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  publishedAt?: string;
  createdAt: string;
  readTime: number;
  viewCount: number;
  author?: { fullName: string };
  gallery?: { _id: string; title: string; isPublished: boolean; photos: unknown[] };
}

export interface BlogFields {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
}

export const BLOG_CATEGORIES = [
  { value: 'news', label: 'News' },
  { value: 'education', label: 'Education' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'events', label: 'Events' },
  { value: 'community', label: 'Community' },
  { value: 'other', label: 'Other' },
];

export const blogService = {
  async list(params: { status?: string; category?: string }) {
    const res = await api.get('/admin/blog', { params });
    return res.data.data.posts as AdminBlogPost[];
  },

  async get(id: string) {
    const res = await api.get(`/admin/blog/${id}`);
    return res.data.data.post as AdminBlogPost;
  },

  async create(form: FormData) {
    const res = await api.post('/admin/blog', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data.data.post as AdminBlogPost;
  },

  async update(id: string, fields: BlogFields) {
    const res = await api.put(`/admin/blog/${id}`, fields);
    return res.data.data.post as AdminBlogPost;
  },

  async togglePublish(id: string) {
    const res = await api.put(`/admin/blog/${id}/publish`);
    return res.data.data.post as AdminBlogPost;
  },

  async remove(id: string) {
    await api.delete(`/admin/blog/${id}`);
  },

  async uploadContentImage(id: string, file: File) {
    const form = new FormData();
    form.append('image', file);
    const res = await api.post(`/admin/blog/${id}/images`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data.data as { url: string; imageId: string };
  },

  async deleteContentImage(id: string, imageId: string) {
    await api.delete(`/admin/blog/${id}/images/${imageId}`);
  },
};

export const apiErrorMessage = (err: unknown, fallback: string) =>
  (err as { response?: { data?: { message?: string } } }).response?.data?.message || fallback;

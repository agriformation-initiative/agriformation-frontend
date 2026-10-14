import api from '@/lib/auth';

export interface StatInput {
  value: string;
  label: string;
  note: string;
}

export interface ProgramInput {
  title: string;
  short: string;
  timeline: string;
  description: string;
  impact: string;
  activities: string[];
}

export interface SettingsData {
  stats: StatInput[] | null;
  programs: ProgramInput[] | null;
}

export const settingsService = {
  async get() {
    const res = await api.get('/settings');
    return res.data.data as SettingsData;
  },

  async save(data: { stats: StatInput[]; programs: ProgramInput[] }) {
    const res = await api.put('/admin/settings', data);
    return res.data.data as { stats: StatInput[]; programs: ProgramInput[] };
  },
};

/* eslint-disable @typescript-eslint/no-explicit-any */
/*eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { volunteerService } from '@/services/volunteerService';
import { Volunteer } from '@/types/indexes';
import toast from 'react-hot-toast';
import { ArrowRight, Loader2 } from 'lucide-react';

const ROLES = [
  'School Gardens Assistant',
  'Agri-Club Facilitator',
  'Media & Comms',
  'Fundraising & Partnerships',
  'Program Coordinator',
  'Other',
];

const AVAILABILITY_OPTIONS = [
  { value: 'weekdays', label: 'Weekdays Only' },
  { value: 'weekends', label: 'Weekends Only' },
  { value: 'both', label: 'Weekdays & Weekends' },
  { value: 'flexible', label: 'Flexible / Any Time' },
];

export default function VolunteerProfile() {
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    preferredRole: '',
    aboutYourself: '',
    skills: [] as string[],
    availability: '',
    location: { state: '', lga: '' },
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await volunteerService.getProfile();
      const v = response.data.volunteer;
      setVolunteer(v);
      setFormData({
        preferredRole: v.preferredRole || '',
        aboutYourself: v.aboutYourself || '',
        skills: v.skills || [],
        availability: v.availability || '',
        location: v.location || { state: '', lga: '' },
      });
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await volunteerService.updateProfile(formData);
      toast.success('Profile updated successfully!');
      loadProfile();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="volunteer">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-stone-600 text-lg">Loading your profile...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="volunteer">
      <div className="max-w-4xl mx-auto space-y-10 py-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 tracking-tight">
            My Volunteer Profile
          </h1>
          <p className="text-xl text-stone-600 mt-3 font-light">
            Help us match you with the perfect program role
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Preferred Role */}
          <div className="bg-white border border-stone-200 rounded-sm shadow-sm p-8">
            <h2 className="text-2xl font-bold text-stone-900 mb-6">Preferred Role</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {ROLES.map((role) => (
                <label
                  key={role}
                  className={`flex items-center gap-4 p-5 border rounded-sm cursor-pointer transition-all ${
                    formData.preferredRole === role
                      ? 'border-green-700 bg-emerald-50 shadow-md'
                      : 'border-stone-300 hover:border-stone-400 hover:bg-stone-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="preferredRole"
                    value={role}
                    checked={formData.preferredRole === role}
                    onChange={(e) => setFormData({ ...formData, preferredRole: e.target.value })}
                    className="w-5 h-5 text-green-700 focus:ring-green-700"
                  />
                  <span className="font-medium text-stone-800">{role}</span>
                </label>
              ))}
            </div>
          </div>

          {/* About Yourself */}
          <div className="bg-white border border-stone-200 rounded-sm shadow-sm p-8">
            <h2 className="text-2xl font-bold text-stone-900 mb-6">Tell Us About Yourself</h2>
            <textarea
              value={formData.aboutYourself}
              onChange={(e) => setFormData({ ...formData, aboutYourself: e.target.value })}
              rows={7}
              placeholder="Share your passion for agriculture, education, youth empowerment, or why you want to volunteer with Agriformation..."
              className="w-full px-5 py-4 border border-stone-300 rounded-sm focus:border-green-700 focus:ring-2 focus:ring-green-700/20 transition-all resize-none text-stone-800 placeholder-stone-400"
            />
          </div>

          {/* Availability */}
          <div className="bg-white border border-stone-200 rounded-sm shadow-sm p-8">
            <h2 className="text-2xl font-bold text-stone-900 mb-6">When Are You Available?</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {AVAILABILITY_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-4 p-5 border rounded-sm cursor-pointer transition-all ${
                    formData.availability === opt.value
                      ? 'border-green-700 bg-emerald-50 shadow-md'
                      : 'border-stone-300 hover:border-stone-400 hover:bg-stone-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="availability"
                    value={opt.value}
                    checked={formData.availability === opt.value}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="w-5 h-5 text-green-700"
                  />
                  <span className="font-medium text-stone-800">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="bg-white border border-stone-200 rounded-sm shadow-sm p-8">
            <h2 className="text-2xl font-bold text-stone-900 mb-6">Your Location</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">State</label>
                <input
                  type="text"
                  value={formData.location.state}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location, state: e.target.value },
                    })
                  }
                  placeholder="e.g. Rivers State"
                  className="w-full px-5 py-3.5 border border-stone-300 rounded-sm focus:border-green-700 focus:ring-2 focus:ring-green-700/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">LGA</label>
                <input
                  type="text"
                  value={formData.location.lga}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location, lga: e.target.value },
                    })
                  }
                  placeholder="e.g. Obio/Akpor"
                  className="w-full px-5 py-3.5 border border-stone-300 rounded-sm focus:border-green-700 focus:ring-2 focus:ring-green-700/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-3 px-8 py-4 bg-green-700 text-white rounded-sm font-semibold hover:bg-green-800 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Saving Changes...
                </>
              ) : (
                <>
                  Save Profile Changes
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Motivational Footer */}
        <div className="text-center py-12 border-t border-stone-200 mt-16">
          <p className="text-2xl font-light text-stone-700 italic max-w-3xl mx-auto leading-relaxed">
            “Your time, skills, and passion are the seeds we plant today
            <br className="hidden md:block" />
            to grow a generation that proudly chooses agriculture tomorrow.”
          </p>
          <p className="text-green-700 font-semibold mt-4 text-lg">— Agriformation Team</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
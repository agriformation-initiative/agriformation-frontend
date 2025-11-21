'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { volunteerService } from '@/services/volunteerService';
import { Volunteer } from '@/types/indexes';
import { format } from 'date-fns';
import { Clock, ScrollText, Trophy, ArrowRight } from 'lucide-react';

export default function VolunteerDashboard() {
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await volunteerService.getProfile();
      setVolunteer(response.data.volunteer);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="volunteer">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-stone-600">Loading your dashboard...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!volunteer) {
    return (
      <DashboardLayout role="volunteer">
        <div className="text-center py-20">
          <p className="text-stone-600 text-lg">No volunteer profile found</p>
        </div>
      </DashboardLayout>
    );
  }

  const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-800 border border-amber-200',
      approved: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
      active: 'bg-green-100 text-green-800 border border-green-200',
      completed: 'bg-teal-100 text-teal-800 border border-teal-200',
      rejected: 'bg-red-100 text-red-800 border border-red-200',
      'on-hold': 'bg-stone-100 text-stone-700 border border-stone-300',
    };

    return (
      <span
        className={`px-4 py-1.5 rounded text-sm font-medium ${styles[status] || styles['on-hold']}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </span>
    );
  };

  return (
    <DashboardLayout role="volunteer">
      <div className="space-y-10 py-8 px-5 md:px-8 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 tracking-tight">
            Welcome back, {volunteer.firstName}!
          </h1>
          <p className="text-xl text-stone-600 mt-3 font-light">
            You&apos;re making a real difference in Nigerian agricultural education
          </p>
        </div>

        {/* Impact Stats Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Hours Contributed */}
          <div className="bg-white border border-stone-200 rounded-sm shadow-sm hover:shadow-md transition-shadow p-8">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-emerald-100 rounded-sm">
                <Clock className="w-8 h-8 text-green-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-600">Hours Contributed</p>
                <p className="text-4xl font-bold text-stone-900 mt-1">
                  {volunteer.hoursContributed}
                </p>
              </div>
            </div>
          </div>

          {/* Active Programs */}
          <div className="bg-white border border-stone-200 rounded-sm shadow-sm hover:shadow-md transition-shadow p-8">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-amber-100 rounded-sm">
                <Trophy className="w-8 h-8 text-amber-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-600">Active Programs</p>
                <p className="text-4xl font-bold text-stone-900 mt-1">
                  {volunteer.assignedPrograms?.filter(p => p.status === 'active').length || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Certificates Earned */}
          <div className="bg-white border border-stone-200 rounded-sm shadow-sm hover:shadow-md transition-shadow p-8">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-teal-100 rounded-sm">
                <ScrollText className="w-8 h-8 text-teal-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-600">Certificates Earned</p>
                <p className="text-4xl font-bold text-stone-900 mt-1">
                  {volunteer.certificatesIssued?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Status Card */}
        <div className="bg-white border border-stone-200 rounded-sm shadow-sm p-8">
          <h2 className="text-2xl font-bold text-stone-900 mb-6">Profile Status</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <p className="text-sm font-medium text-stone-600">Current Application Status</p>
              <StatusBadge status={volunteer.status} />
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium text-stone-600">Preferred Role</p>
              <p className="text-lg font-semibold text-stone-800 capitalize">
                {volunteer.preferredRole.replace(/-/g, ' ')}
              </p>
            </div>
          </div>
        </div>

        {/* Assigned Programs */}
        {volunteer.assignedPrograms && volunteer.assignedPrograms.length > 0 && (
          <div className="bg-white border border-stone-200 rounded-sm shadow-sm p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-stone-900">Your Assigned Programs</h2>
              <span className="text-sm text-stone-500">
                {volunteer.assignedPrograms.length} program{volunteer.assignedPrograms.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="space-y-6">
              {volunteer.assignedPrograms.map((program) => (
                <div
                  key={program.id}
                  className="border border-stone-200 rounded-sm p-6 hover:border-green-700/30 transition-colors group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-stone-900">{program.programName}</h3>
                      <p className="text-stone-600 mt-1">Role: <span className="font-medium">{program.role}</span></p>
                    </div>
                    <StatusBadge status={program.status} />
                  </div>

                  <div className="flex flex-wrap gap-6 text-sm text-stone-600 mt-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Start:</span>
                      {format(new Date(program.startDate), 'MMMM d, yyyy')}
                    </div>
                    {program.endDate && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">End:</span>
                        {format(new Date(program.endDate), 'MMMM d, yyyy')}
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <a
                      href={`/volunteer/programs/${program.id}`}
                      className="inline-flex items-center gap-2 text-green-700 font-medium hover:gap-3 transition-all text-sm group"
                    >
                      View Program Details
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Motivational Footer */}
        <div className="text-center py-12">
          <p className="text-2xl font-light text-stone-700 italic max-w-3xl mx-auto leading-relaxed">
            “Every hour you contribute helps a Nigerian student see agriculture not as punishment,
            <br className="hidden md:block" />
            but as a future full of dignity, innovation, and opportunity.”
          </p>
          <p className="text-green-700 font-semibold mt-4">— Team Agriformation</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
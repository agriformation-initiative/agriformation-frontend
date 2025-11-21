'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { adminService } from '@/services/adminService';
import { DashboardStats, VolunteerApplication } from '@/types/indexes';
import { format } from 'date-fns';
import { FaUsers, FaUserCheck, FaClock, FaFileAlt, FaEllipsisV } from 'react-icons/fa';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentApplications, setRecentApplications] = useState<VolunteerApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await adminService.getDashboardStats();
      setStats(response.data.stats);
      setRecentApplications(response.data.recentApplications);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Welcome back 👋</h1>
          <p className="text-gray-600">Here&apos;s what&apos;s happening with your volunteers today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard
            icon={<FaUsers />}
            title="Total Volunteers"
            value={stats?.totalVolunteers || 0}
            gradient="from-blue-500 to-blue-600"
          />
          <StatCard
            icon={<FaUserCheck />}
            title="Active This Month"
            value={stats?.activeVolunteers || 0}
            gradient="from-emerald-500 to-emerald-600"
          />
          <StatCard
            icon={<FaFileAlt />}
            title="Needs Review"
            value={stats?.pendingApplications || 0}
            gradient="from-amber-500 to-amber-600"
          />
          <StatCard
            icon={<FaClock />}
            title="Hours Logged"
            value={`${stats?.totalHoursContributed || 0}h`}
            gradient="from-purple-500 to-purple-600"
          />
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
              <p className="text-sm text-gray-500 mt-0.5">New volunteers waiting for review</p>
            </div>
            <Link href="/admin/applications" className="text-sm font-medium text-green-700 hover:text-green-800 transition-colors">
              View all
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                <FaFileAlt className="text-gray-400" />
              </div>
              <p className="text-gray-500">No recent applications</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentApplications.map((app) => (
                <div key={app._id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-700 to-green-800 flex items-center justify-center text-white font-medium text-sm">
                        {app.fullName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{app.fullName}</h3>
                        <p className="text-sm text-gray-500 truncate">{app.email}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {app.preferredRole}
                          </span>
                          <span className="text-xs text-gray-400">
                            {format(new Date(app.createdAt), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={app.status} />
                      <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <FaEllipsisV className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/admin/applications" className="px-4 py-2 bg-green-700 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm inline-block">
            Review Applications
          </Link>
          
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ icon, title, value, gradient }: { icon: React.ReactNode; title: string; value: number | string; gradient: string }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-sm`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    reviewed: 'bg-blue-50 text-blue-700 border-blue-200',
    accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'on-hold': 'bg-gray-50 text-gray-700 border-gray-200',
  };
  
  return (
    <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
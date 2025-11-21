/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { adminService } from '@/services/adminService';
import { Volunteer } from '@/types/indexes';
import { FaEye } from 'react-icons/fa';

export default function VolunteersPage() {
  const router = useRouter();
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadVolunteers();
  }, [statusFilter]);

  const loadVolunteers = async () => {
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const response = await adminService.getAllVolunteers(params);
      // the API returns items: Volunteer[]; use that (with a safe fallback)
      setVolunteers(response.data.items ?? (response.data as any).volunteers ?? []);
    } catch (error) {
      console.error('Failed to load volunteers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-stone-600">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6 bg-stone-50 min-h-screen ">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-stone-900 tracking-tight">Volunteers</h1>
            <p className="text-stone-600 mt-2 text-lg">Manage volunteer profiles</p>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-48 px-4 py-2.5 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition-all text-stone-900 bg-white font-medium"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="on-hold">On Hold</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="bg-white rounded-sm border border-stone-200 shadow-sm overflow-hidden">
          {volunteers.length === 0 ? (
            <p className="text-stone-500 text-center py-12">No volunteers found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">Hours</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {volunteers.map((volunteer) => {
                    const user = typeof volunteer.user === 'object' ? volunteer.user : null;
                    return (
                      <tr key={volunteer._id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-stone-900 font-medium">
                          {user?.fullName || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">
                          {user?.email || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">
                          {volunteer.preferredRole}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">
                          {volunteer.hoursContributed}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={volunteer.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => router.push(`/admin/volunteers/${volunteer._id}`)}
                            className="p-2 text-green-700 hover:bg-green-50 rounded transition-colors"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    pending: 'bg-amber-50 text-amber-800 border border-amber-200',
    approved: 'bg-emerald-900/5 text-green-700 border border-emerald-900/10',
    rejected: 'bg-red-50 text-red-800 border border-red-200',
    'on-hold': 'bg-stone-100 text-stone-600 border border-stone-200',
  };
  return (
    <span className={`px-3 py-1.5 rounded text-xs font-medium ${colors[status as keyof typeof colors]}`}>
      {status}
    </span>
  );
}
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { adminService } from '@/services/adminService';
import { VolunteerApplication } from '@/types/indexes';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import { X } from 'lucide-react';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedApp, setSelectedApp] = useState<VolunteerApplication | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadApplications();
  }, [statusFilter]);

  const loadApplications = async () => {
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const response = await adminService.getApplications(params);
      const apps = response?.data?.applications ?? [];
      const safeApps = Array.isArray(apps) ? (apps as VolunteerApplication[]) : [];
      setApplications(safeApps);
    } catch (error) {
      console.error('Failed to load applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id: string, status: 'accepted' | 'rejected', notes?: string) => {
    try {
      await adminService.reviewApplication(id, { status, notes });
      toast.success(`Application ${status}!`);
      loadApplications();
      setShowModal(false);
      setSelectedApp(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to review application');
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-stone-600">Loading applications...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-stone-900 tracking-tight">
              Volunteer Applications
            </h1>
            <p className="text-lg text-stone-600 mt-2 font-light">
              Review and manage incoming volunteer applications
            </p>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-5 py-3 bg-white border border-stone-300 rounded text-stone-700 font-medium focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition-shadow shadow-sm"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white border border-stone-200 rounded-sm shadow-sm overflow-hidden">
          {applications.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-stone-500 text-lg">No applications found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    {['Name', 'Email', 'Role', 'Date Applied', 'Status', 'Actions'].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-6 py-5 font-medium text-stone-900">{app.fullName}</td>
                      <td className="px-6 py-5 text-stone-600">{app.email}</td>
                      <td className="px-6 py-5 text-stone-700">{app.preferredRole}</td>
                      <td className="px-6 py-5 text-sm text-stone-600">
                        {format(new Date(app.createdAt), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-5">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              setSelectedApp(app);
                              setShowModal(true);
                            }}
                            className="p-2.5 text-stone-600 hover:bg-stone-100 rounded transition-colors"
                            title="View Details"
                          >
                            <FaEye size={16} />
                          </button>
                          {app.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleReview(app._id, 'accepted')}
                                className="p-2.5 text-green-700 hover:bg-emerald-50 rounded transition-colors"
                                title="Accept"
                              >
                                <FaCheck size={16} />
                              </button>
                              <button
                                onClick={() => handleReview(app._id, 'rejected')}
                                className="p-2.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Reject"
                              >
                                <FaTimes size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedApp && (
        <ApplicationModal
          application={selectedApp}
          onClose={() => {
            setShowModal(false);
            setSelectedApp(null);
          }}
          onReview={handleReview}
        />
      )}
    </DashboardLayout>
  );
}

// Reusable Status Badge – matches homepage style
function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-800 border border-amber-200',
    reviewed: 'bg-blue-50 text-blue-800 border border-blue-200',
    accepted: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    rejected: 'bg-red-50 text-red-800 border border-red-200',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded text-xs font-semibold ${variants[status] || 'bg-gray-100 text-gray-800'}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// Modal – fully redesigned to match the aesthetic
function ApplicationModal({
  application,
  onClose,
  onReview,
}: {
  application: VolunteerApplication;
  onClose: () => void;
  onReview: (id: string, status: 'accepted' | 'rejected', notes?: string) => void;
}) {
  const [notes, setNotes] = useState('');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
      <div className="bg-white rounded-sm shadow-2xl border border-stone-200 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-8 border-b border-stone-200">
          <h2 className="text-3xl font-bold text-stone-900 tracking-tight">Application Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded transition-colors"
          >
            <X size={20} className="text-stone-600" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="text-sm font-semibold text-stone-600 uppercase tracking-wider">Full Name</label>
              <p className="mt-2 text-xl font-medium text-stone-900">{application.fullName}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-stone-600 uppercase tracking-wider">Email</label>
              <p className="mt-2 text-lg text-stone-800">{application.email}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-stone-600 uppercase tracking-wider">Preferred Role</label>
            <p className="mt-2 text-xl text-stone-900">{application.preferredRole}</p>
          </div>

          <div>
            <label className="text-sm font-semibold text-stone-600 uppercase tracking-wider">About Themselves</label>
            <p className="mt-3 text-stone-700 leading-relaxed whitespace-pre-wrap bg-stone-50 p-5 rounded-sm border border-stone-200">
              {application.aboutYourself}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-stone-600 uppercase tracking-wider">Current Status</span>
            <StatusBadge status={application.status} />
          </div>

          {application.status === 'pending' && (
            <div>
              <label htmlFor="notes" className="block text-sm font-semibold text-stone-600 uppercase tracking-wider mb-3">
                Review Notes (Optional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition-shadow"
                placeholder="Add any internal notes about this applicant..."
              />
            </div>
          )}
        </div>

        <div className="p-8 border-t border-stone-200 flex justify-end gap-4 bg-stone-50">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white text-stone-700 border border-stone-300 rounded font-medium hover:bg-stone-100 transition-colors"
          >
            Close
          </button>
          {application.status === 'pending' && (
            <>
              <button
                onClick={() => onReview(application._id, 'rejected', notes)}
                className="px-6 py-3 bg-red-600 text-white rounded font-medium hover:bg-red-700 transition-colors shadow-sm"
              >
                Reject Application
              </button>
              <button
                onClick={() => onReview(application._id, 'accepted', notes)}
                className="px-6 py-3 bg-green-700 text-white rounded font-medium hover:bg-green-800 transition-colors shadow-sm"
              >
                Accept Application
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
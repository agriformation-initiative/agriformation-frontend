/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { adminService } from '@/services/adminService';
import { Volunteer } from '@/types/indexes';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa';

export default function VolunteerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    loadVolunteer();
  }, [params.id]);

  const loadVolunteer = async () => {
    try {
      const response = await adminService.getVolunteerDetails(params.id as string);
      setVolunteer(response.data.volunteer);
    } catch (error) {
      console.error('Failed to load volunteer:', error);
      toast.error('Failed to load volunteer details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div>Loading...</div>
      </DashboardLayout>
    );
  }

  if (!volunteer) {
    return (
      <DashboardLayout role="admin">
        <div className="text-center py-12">
          <p className="text-gray-600">Volunteer not found</p>
        </div>
      </DashboardLayout>
    );
  }

  const user = typeof volunteer.user === 'object' ? volunteer.user : null;

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
        >
          <FaArrowLeft /> Back
        </button>

        {/* Header */}
        <div className="card">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{user?.fullName}</h1>
              <p className="text-gray-600 mt-1">{user?.email}</p>
              {user?.phoneNumber && (
                <p className="text-gray-600">{user.phoneNumber}</p>
              )}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => setShowStatusModal(true)}
                className="btn btn-secondary"
              >
                Update Status
              </button>
              <button
                onClick={() => setShowAssignModal(true)}
                className="btn btn-primary"
              >
                Assign to Program
              </button>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Volunteer Information</h2>
            <div className="space-y-3">
              <DetailRow label="Preferred Role" value={volunteer.preferredRole} />
              <DetailRow label="Status" value={<StatusBadge status={volunteer.status} />} />
              <DetailRow label="Availability" value={volunteer.availability || 'N/A'} />
              <DetailRow
                label="Location"
                value={
                  volunteer.location
                    ? `${volunteer.location.state}, ${volunteer.location.lga}`
                    : 'N/A'
                }
              />
              <DetailRow
                label="Hours Contributed"
                value={volunteer.hoursContributed.toString()}
              />
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{volunteer.aboutYourself}</p>
          </div>
        </div>

        {/* Programs */}
        {volunteer.assignedPrograms && volunteer.assignedPrograms.length > 0 && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Assigned Programs</h2>
            <div className="space-y-4">
              {volunteer.assignedPrograms.map((program, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{program.programName}</h3>
                      <p className="text-sm text-gray-600">{program.role}</p>
                    </div>
                    <StatusBadge status={program.status} />
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>Start: {format(new Date(program.startDate), 'MMM dd, yyyy')}</span>
                    {program.endDate && (
                      <span>End: {format(new Date(program.endDate), 'MMM dd, yyyy')}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Review Notes */}
        {volunteer.reviewNotes && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Review Notes</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{volunteer.reviewNotes}</p>
          </div>
        )}
      </div>

      {showStatusModal && (
        <StatusModal
          volunteer={volunteer}
          onClose={() => setShowStatusModal(false)}
          onSuccess={() => {
            setShowStatusModal(false);
            loadVolunteer();
          }}
        />
      )}

      {showAssignModal && (
        <AssignModal
          volunteer={volunteer}
          onClose={() => setShowAssignModal(false)}
          onSuccess={() => {
            setShowAssignModal(false);
            loadVolunteer();
          }}
        />
      )}
    </DashboardLayout>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    'on-hold': 'bg-gray-100 text-gray-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    paused: 'bg-gray-100 text-gray-800',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}>
      {status}
    </span>
  );
}

function StatusModal({
  volunteer,
  onClose,
  onSuccess,
}: {
  volunteer: Volunteer;
  onClose: () => void;
  onSuccess: () => void;
}) {
  type VolunteerStatus = 'pending' | 'approved' | 'on-hold' | 'rejected';

  const [status, setStatus] = useState<VolunteerStatus>(volunteer.status as VolunteerStatus);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await adminService.updateVolunteerStatus(volunteer._id, { status, notes });
      toast.success('Status updated successfully');
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold">Update Status</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={status}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value as VolunteerStatus)}
              className="input"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="on-hold">On Hold</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="input"
              placeholder="Add any notes..."
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AssignModal({
  volunteer,
  onClose,
  onSuccess,
}: {
  volunteer: Volunteer;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    programName: '',
    role: '',
    startDate: '',
    endDate: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await adminService.assignToProgram(volunteer._id, formData);
      toast.success('Volunteer assigned to program successfully');
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to assign volunteer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold">Assign to Program</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Program Name *</label>
            <input
              type="text"
              value={formData.programName}
              onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Role *</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Start Date *</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">End Date (Optional)</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="input"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Assigning...' : 'Assign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

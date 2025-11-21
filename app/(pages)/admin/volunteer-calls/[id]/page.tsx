// app/admin/volunteer-calls/[id]/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Eye,
  Edit,
  Trash2,
  Globe,
  GlobeLock,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import Image from 'next/image';

interface Application {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
}

interface VolunteerCall {
  _id: string;
  title: string;
  description: string;
  requirements: string;
  designImage: {
    url: string;
  };
  eventDate: string;
  location: string;
  numberOfVolunteers: number;
  deadline: string;
  category: string;
  status: string;
  isPublished: boolean;
  applications: Application[];
  viewCount: number;
  createdAt: string;
}

export default function VolunteerCallDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [call, setCall] = useState<VolunteerCall | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'details' | 'applications'>('details');

  useEffect(() => {
    if (params.id) {
      fetchVolunteerCall();
    }
  }, [params.id]);

  const fetchVolunteerCall = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/volunteer-calls/${params.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setCall(data.data.call);
      }
    } catch (error) {
      console.error('Error fetching volunteer call:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async () => {
    if (!call) return;

    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/volunteer-calls/${call._id}/publish`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setCall(data.data.call);
        alert(`Volunteer call ${data.data.call.isPublished ? 'published' : 'unpublished'} successfully`);
      }
    } catch (error) {
      console.error('Error toggling publish status:', error);
      alert('Failed to update publish status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!call) return;

    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/volunteer-calls/${call._id}/status`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setCall(data.data.call);
        alert('Status updated successfully');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateApplicationStatus = async (applicationId: string, status: string) => {
    if (!call) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/volunteer-calls/${call._id}/applications/${applicationId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setCall(data.data.call);
        alert('Application status updated successfully');
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update application status');
    }
  };

  const handleDelete = async () => {
    if (!call) return;

    if (!confirm('Are you sure you want to delete this volunteer call? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/volunteer-calls/${call._id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      
      if (data.success) {
        alert('Volunteer call deleted successfully');
        router.push('/admin/volunteer-calls');
      }
    } catch (error) {
      console.error('Error deleting volunteer call:', error);
      alert('Failed to delete volunteer call');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getApplicationStatusBadge = (status: string) => {
    const styles = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
      accepted: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
    };

    const style = styles[status as keyof typeof styles];
    const Icon = style.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        <Icon size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-green-700" size={40} />
        </div>
      </DashboardLayout>
    );
  }

  if (!call) {
    return (
      <DashboardLayout role="admin">
        <div className="text-center py-12">
          <p className="text-stone-500 text-lg">Volunteer call not found</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-green-700 hover:text-green-800 font-medium"
          >
            Go Back
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const pendingCount = call.applications.filter(app => app.status === 'pending').length;
  const acceptedCount = call.applications.filter(app => app.status === 'accepted').length;
  const rejectedCount = call.applications.filter(app => app.status === 'rejected').length;

  return (
    <DashboardLayout role="admin">
      <div className="max-w-6xl">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-stone-600 hover:text-green-700 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Volunteer Calls</span>
        </button>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            onClick={handleTogglePublish}
            disabled={actionLoading}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
              call.isPublished
                ? 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                : 'bg-green-700 text-white hover:bg-green-800'
            }`}
          >
            {call.isPublished ? <GlobeLock size={18} /> : <Globe size={18} />}
            {call.isPublished ? 'Unpublish' : 'Publish'}
          </button>

          <select
            value={call.status}
            onChange={(e) => handleUpdateStatus(e.target.value)}
            disabled={actionLoading}
            className="px-4 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="draft">Draft</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            onClick={() => router.push(`/admin/volunteer-calls/${call._id}/edit`)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-stone-300 text-stone-700 rounded-md font-medium hover:bg-stone-50 transition-colors"
          >
            <Edit size={18} />
            Edit
          </button>

          <button
            onClick={handleDelete}
            disabled={actionLoading}
            className="inline-flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-md font-medium hover:bg-red-50 transition-colors"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-stone-200 mb-6">
          <div className="flex gap-6">
            <button
              onClick={() => setSelectedTab('details')}
              className={`pb-3 px-1 font-medium transition-colors relative ${
                selectedTab === 'details'
                  ? 'text-green-700'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              Details
              {selectedTab === 'details' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-700" />
              )}
            </button>
            <button
              onClick={() => setSelectedTab('applications')}
              className={`pb-3 px-1 font-medium transition-colors relative ${
                selectedTab === 'applications'
                  ? 'text-green-700'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              Applications ({call.applications.length})
              {selectedTab === 'applications' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-700" />
              )}
            </button>
          </div>
        </div>

        {/* Details Tab */}
        {selectedTab === 'details' && (
          <div className="space-y-6">
            {/* Design Image */}
            <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
              <div className="relative h-96">
                <Image
                  src={call.designImage.url}
                  alt={call.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="text-green-700" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-stone-500">Applications</p>
                    <p className="text-xl font-bold text-stone-900">{call.applications.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Eye className="text-blue-700" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-stone-500">Views</p>
                    <p className="text-xl font-bold text-stone-900">{call.viewCount}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-purple-700" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-stone-500">Accepted</p>
                    <p className="text-xl font-bold text-stone-900">{acceptedCount}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="text-yellow-700" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-stone-500">Pending</p>
                    <p className="text-xl font-bold text-stone-900">{pendingCount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Details */}
            <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
              <h2 className="text-2xl font-bold text-stone-900 mb-4">{call.title}</h2>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 text-stone-600">
                  <Calendar size={20} className="text-stone-400" />
                  <div>
                    <p className="text-xs text-stone-500">Event Date</p>
                    <p className="font-medium">{formatDate(call.eventDate)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-stone-600">
                  <Calendar size={20} className="text-stone-400" />
                  <div>
                    <p className="text-xs text-stone-500">Deadline</p>
                    <p className="font-medium">{formatDate(call.deadline)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-stone-600">
                  <MapPin size={20} className="text-stone-400" />
                  <div>
                    <p className="text-xs text-stone-500">Location</p>
                    <p className="font-medium">{call.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-stone-600">
                  <Users size={20} className="text-stone-400" />
                  <div>
                    <p className="text-xs text-stone-500">Volunteers Needed</p>
                    <p className="font-medium">{call.numberOfVolunteers}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-stone-900 mb-2">Description</h3>
                  <p className="text-stone-600 whitespace-pre-wrap">{call.description}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-stone-900 mb-2">Requirements</h3>
                  <p className="text-stone-600 whitespace-pre-wrap">{call.requirements}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-stone-900 mb-2">Category</h3>
                  <span className="inline-block px-3 py-1 bg-stone-100 text-stone-700 rounded-full text-sm">
                    {call.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {selectedTab === 'applications' && (
          <div>
            {call.applications.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-12 text-center">
                <Users className="mx-auto text-stone-300 mb-4" size={48} />
                <p className="text-stone-500 text-lg">No applications yet</p>
                <p className="text-stone-400 text-sm mt-2">
                  Applications will appear here once volunteers start applying
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Summary */}
                <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-4">
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <span className="text-stone-600">
                        Pending: <span className="font-semibold">{pendingCount}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-stone-600">
                        Accepted: <span className="font-semibold">{acceptedCount}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-stone-600">
                        Rejected: <span className="font-semibold">{rejectedCount}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Applications List */}
                {call.applications.map((application) => (
                  <div
                    key={application._id}
                    className="bg-white rounded-lg shadow-sm border border-stone-200 p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-stone-900">
                          {application.fullName}
                        </h3>
                        <p className="text-sm text-stone-500">
                          Applied on {formatDate(application.appliedAt)}
                        </p>
                      </div>
                      {getApplicationStatusBadge(application.status)}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-stone-500 mb-1">Email</p>
                        <a
                          href={`mailto:${application.email}`}
                          className="text-sm text-green-700 hover:underline"
                        >
                          {application.email}
                        </a>
                      </div>
                      <div>
                        <p className="text-xs text-stone-500 mb-1">Phone</p>
                        <a
                          href={`tel:${application.phoneNumber}`}
                          className="text-sm text-green-700 hover:underline"
                        >
                          {application.phoneNumber}
                        </a>
                      </div>
                    </div>

                    {application.message && (
                      <div className="mb-4">
                        <p className="text-xs text-stone-500 mb-1">Message</p>
                        <p className="text-sm text-stone-700 bg-stone-50 p-3 rounded-md">
                          {application.message}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t border-stone-200">
                      {application.status !== 'accepted' && (
                        <button
                          onClick={() => handleUpdateApplicationStatus(application._id, 'accepted')}
                          className="px-4 py-2 bg-green-700 text-white rounded-md text-sm font-medium hover:bg-green-800 transition-colors"
                        >
                          Accept
                        </button>
                      )}
                      {application.status !== 'rejected' && (
                        <button
                          onClick={() => handleUpdateApplicationStatus(application._id, 'rejected')}
                          className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                          Reject
                        </button>
                      )}
                      {application.status !== 'pending' && (
                        <button
                          onClick={() => handleUpdateApplicationStatus(application._id, 'pending')}
                          className="px-4 py-2 border border-stone-300 text-stone-700 rounded-md text-sm font-medium hover:bg-stone-50 transition-colors"
                        >
                          Set to Pending
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
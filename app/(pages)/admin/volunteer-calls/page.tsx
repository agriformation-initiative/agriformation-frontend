/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Eye, Users, Calendar, MapPin, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import Image from 'next/image';

interface VolunteerCall {
  _id: string;
  title: string;
  description: string;
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
  applications: any[];
  viewCount: number;
  createdAt: string;
}

export default function VolunteerCallsPage() {
  const router = useRouter();
  const [calls, setCalls] = useState<VolunteerCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'farm_work', label: 'Farm Work' },
    { value: 'event_support', label: 'Event Support' },
    { value: 'community_outreach', label: 'Community Outreach' },
    { value: 'training', label: 'Training' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'other', label: 'Other' },
  ];

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'open', label: 'Open' },
    { value: 'closed', label: 'Closed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  useEffect(() => {
    fetchVolunteerCalls();
  }, [statusFilter, categoryFilter]);

  const fetchVolunteerCalls = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      let url = `${process.env.NEXT_PUBLIC_API_URL}/admin/volunteer-calls?`;
      if (statusFilter !== 'all') url += `status=${statusFilter}&`;
      if (categoryFilter !== 'all') url += `category=${categoryFilter}&`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setCalls(data.data.calls);
      }
    } catch (error) {
      console.error('Error fetching volunteer calls:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCalls = calls.filter((call) =>
    call.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    call.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // app/admin/volunteer-calls/page.tsx

const getStatusBadge = (call: VolunteerCall) => {
  // Check if deadline has passed for open calls
  const isExpired = call.status === 'open' && new Date() > new Date(call.deadline);
  const displayStatus = isExpired ? 'closed' : call.status;
  
  const styles = {
    draft: 'bg-stone-100 text-stone-700',
    open: 'bg-green-100 text-green-700',
    closed: 'bg-red-100 text-red-700',
    cancelled: 'bg-stone-200 text-stone-600',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[displayStatus as keyof typeof styles]}`}>
      {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
      {isExpired && <span className="ml-1">(Expired)</span>}
    </span>
  );
};

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <DashboardLayout role="admin">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">Volunteer Calls</h1>
            <p className="text-stone-600 mt-1">Manage volunteer opportunities</p>
          </div>
          <button
            onClick={() => router.push('/admin/volunteer-calls/create')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-700 text-white rounded-md font-medium hover:bg-green-800 transition-colors"
          >
            <Plus size={20} />
            Create New Call
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-4 mb-6">
          <div className="grid sm:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
              <input
                type="text"
                placeholder="Search by title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Calls Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-green-700" size={40} />
          </div>
        ) : filteredCalls.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-12 text-center">
            <p className="text-stone-500 text-lg">No volunteer calls found</p>
            <button
              onClick={() => router.push('/admin/volunteer-calls/create')}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-green-700 hover:text-green-800 font-medium"
            >
              <Plus size={20} />
              Create your first volunteer call
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCalls.map((call) => (
              <div
                key={call._id}
                onClick={() => router.push(`/admin/volunteer-calls/${call._id}`)}
                className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
              >
                {/* Image */}
                <div className="relative h-48 bg-stone-100">
                  <Image
                    src={call.designImage.url}
                    alt={call.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(call)}
                  </div>
                  {!call.isPublished && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                        Unpublished
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-stone-900 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
                    {call.title}
                  </h3>

                  <div className="space-y-2 text-sm text-stone-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-stone-400" />
                      <span>{formatDate(call.eventDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-stone-400" />
                      <span className="line-clamp-1">{call.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-stone-400" />
                      <span>{call.numberOfVolunteers} volunteers needed</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-3 border-t border-stone-200">
                    <div className="flex items-center gap-4 text-xs text-stone-500">
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{call.applications?.length || 0} applicants</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye size={14} />
                        <span>{call.viewCount} views</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
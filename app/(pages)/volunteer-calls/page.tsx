// app/volunteer/page.tsx
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Users, Search, Loader2 } from 'lucide-react';
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
}

export default function VolunteerOpportunitiesPage() {
  const router = useRouter();
  const [calls, setCalls] = useState<VolunteerCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = [
    { value: 'all', label: 'All Opportunities' },
    { value: 'farm_work', label: 'Farm Work' },
    { value: 'event_support', label: 'Event Support' },
    { value: 'community_outreach', label: 'Community Outreach' },
    { value: 'training', label: 'Training' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'other', label: 'Other' },
  ];

  const fetchVolunteerCalls = useCallback(async () => {
    try {
      setLoading(true);
      let url = `${process.env.NEXT_PUBLIC_API_URL}/volunteer-calls?`;
      if (categoryFilter !== 'all') {
        url += `category=${categoryFilter}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setCalls(data.data.calls);
      }
    } catch (error) {
      console.error('Error fetching volunteer calls:', error);
    } finally {
      setLoading(false);
    }
  }, [categoryFilter]); // categoryFilter is now safely included

  // Now the effect is clean and warning-free
  useEffect(() => {
    fetchVolunteerCalls();
  }, [fetchVolunteerCalls]);

  const filteredCalls = calls.filter((call) =>
    call.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    call.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Volunteer Opportunities</h1>
          <p className="text-xl text-green-100 max-w-2xl">
            Join us in making a difference. Explore available volunteer opportunities and apply today.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-lg shadow-lg border border-stone-200 p-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
              <input
                type="text"
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-green-700" size={40} />
          </div>
        ) : filteredCalls.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-12 text-center">
            <Users className="mx-auto text-stone-300 mb-4" size={48} />
            <p className="text-stone-500 text-lg">No volunteer opportunities available</p>
            <p className="text-stone-400 text-sm mt-2">
              Check back soon for new opportunities
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCalls.map((call) => (
              <div
                key={call._id}
                onClick={() => router.push(`/volunteer-calls/${call._id}`)}
                className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
              >
                {/* Image */}
                <div className="relative h-56 bg-stone-100">
                  <Image
                    src={call.designImage.url}
                    alt={call.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-green-700 text-white rounded-full text-xs font-medium">
                      Open
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-stone-900 mb-3 line-clamp-2 group-hover:text-green-700 transition-colors">
                    {call.title}
                  </h3>

                  <p className="text-stone-600 text-sm mb-4 line-clamp-2">
                    {call.description}
                  </p>

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

                  {/* Deadline */}
                  <div className="pt-4 border-t border-stone-200">
                    <p className="text-xs text-stone-500">
                      Apply before: <span className="font-medium text-stone-700">{formatDate(call.deadline)}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
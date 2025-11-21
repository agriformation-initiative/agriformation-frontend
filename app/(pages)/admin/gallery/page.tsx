/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  MapPin,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Loader2,
  Images,
} from 'lucide-react';
import { galleryService } from '@/services/galleryService';
import { Gallery } from '@/types/indexes';
import DashboardLayout from '@/components/Layout/DashboardLayout';

export default function AdminGalleriesPage() {
  const router = useRouter();
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPublished, setFilterPublished] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    totalGalleries: 0,
    publishedGalleries: 0,
    totalPhotos: 0,
    totalViews: 0,
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'farm_excursion', label: 'Farm Excursions' },
    { value: 'workshop', label: 'Workshops' },
    { value: 'community_event', label: 'Community Events' },
    { value: 'training', label: 'Training Sessions' },
    { value: 'other', label: 'Other' },
  ];

  useEffect(() => {
    fetchGalleries();
    fetchStats();
  }, [filterCategory, filterPublished]);

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filterCategory !== 'all') params.category = filterCategory;
      if (filterPublished !== 'all') params.isPublished = filterPublished === 'published';

      const response = await galleryService.getAllGalleries(params);
      setGalleries(response.data.galleries);
    } catch (error) {
      console.error('Error fetching galleries:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await galleryService.getGalleryStats();
      console.log('Stats response:', response);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      await galleryService.togglePublishStatus(id);
      fetchGalleries();
      fetchStats();
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery? This action cannot be undone.')) {
      return;
    }

    try {
      await galleryService.deleteGallery(id);
      fetchGalleries();
      fetchStats();
    } catch (error) {
      console.error('Error deleting gallery:', error);
    }
  };

  const filteredGalleries = galleries.filter((gallery) =>
    gallery.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gallery.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">Photo Galleries</h1>
            <p className="text-stone-600 mt-1">Manage your photo galleries and albums</p>
          </div>
          <button
            onClick={() => router.push('/admin/gallery/create')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-700 text-white rounded-md font-medium hover:bg-green-800 transition-colors shadow-sm"
          >
            <Plus size={20} />
            Create Gallery
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-stone-600 text-sm font-medium">Total Galleries</span>
              <Images className="text-green-700" size={20} />
            </div>
            <p className="text-3xl font-bold text-stone-900">{stats.totalGalleries}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-stone-600 text-sm font-medium">Published</span>
              <Eye className="text-blue-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-stone-900">{stats.publishedGalleries}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-stone-600 text-sm font-medium">Total Photos</span>
              <Images className="text-purple-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-stone-900">{stats.totalPhotos}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-stone-600 text-sm font-medium">Total Views</span>
              <Eye className="text-amber-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-stone-900">{stats.totalViews}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-stone-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
              <input
                type="text"
                placeholder="Search galleries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-stone-300 rounded-md hover:bg-stone-50 transition-colors"
            >
              <Filter size={20} />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="grid sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-stone-200">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Category
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Status
                </label>
                <select
                  value={filterPublished}
                  onChange={(e) => setFilterPublished(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Galleries Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-green-700" />
          </div>
        ) : filteredGalleries.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGalleries.map((gallery) => (
              <div
                key={gallery._id}
                className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-video relative bg-stone-200">
                  {gallery.coverImage?.url ? (
                    <Image
                      src={gallery.coverImage.url}
                      width={600}
                      height={400}
                      alt={gallery.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Images className="text-stone-400" size={48} />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        gallery.isPublished
                          ? 'bg-green-100 text-green-700'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {gallery.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-lg text-stone-900 line-clamp-2">
                      {gallery.title}
                    </h3>
                  </div>

                  <p className="text-sm text-stone-600 line-clamp-2">
                    {gallery.description}
                  </p>

                  <div className="flex flex-wrap gap-3 text-xs text-stone-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{formatDate(gallery.eventDate)}</span>
                    </div>
                    {gallery.location && (
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span className="truncate max-w-[120px]">{gallery.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                    <span className="text-sm text-stone-600">
                      {gallery.photoCount} {gallery.photoCount === 1 ? 'photo' : 'photos'}
                    </span>
                    <span className="text-xs text-stone-500">{gallery.viewCount} views</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => router.push(`/admin/gallery/${gallery._id}`)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-green-700 text-white rounded-md text-sm font-medium hover:bg-green-800 transition-colors"
                    >
                      <Edit size={16} />
                      Manage
                    </button>
                    <button
                      onClick={() => handleTogglePublish(gallery._id)}
                      className="px-3 py-2 border border-stone-300 rounded-md hover:bg-stone-50 transition-colors"
                      title={gallery.isPublished ? 'Unpublish' : 'Publish'}
                    >
                      {gallery.isPublished ? (
                        <EyeOff size={16} className="text-stone-700" />
                      ) : (
                        <Eye size={16} className="text-stone-700" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(gallery._id)}
                      className="px-3 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg border border-stone-200">
            <Images className="w-16 h-16 mx-auto text-stone-300 mb-4" />
            <h3 className="text-lg font-semibold text-stone-900 mb-2">No galleries found</h3>
            <p className="text-stone-600 mb-6">
              {searchQuery
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first gallery'}
            </p>
            <button
              onClick={() => router.push('/admin/gallery/create')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-700 text-white rounded-md font-medium hover:bg-green-800 transition-colors"
            >
              <Plus size={20} />
              Create Gallery
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
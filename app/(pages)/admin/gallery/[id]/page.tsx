'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft,
  Upload,
  Loader2,
  Star,
  Trash2,
  Edit2,
  Save,
  X,
  Eye,
  EyeOff,
  Calendar,
  MapPin,
  Tag,
} from 'lucide-react';
import { galleryService } from '@/services/galleryService';
import { Gallery, Photo } from '@/types/indexes';
import DashboardLayout from '@/components/Layout/DashboardLayout';

export default function ManageGalleryPage() {
  const params = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingCaption, setEditingCaption] = useState<string | null>(null);
  const [captionText, setCaptionText] = useState('');
  
  // Edit mode states
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [savingDetails, setSavingDetails] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    eventDate: '',
    location: '',
    category: '',
  });

  useEffect(() => {
    if (params.id) {
      fetchGallery(params.id as string);
    }
  }, [params.id]);

  const fetchGallery = async (id: string) => {
    try {
      setLoading(true);
      const response = await galleryService.getGalleryDetails(id);
      setGallery(response.data.gallery);
      
      // Initialize edit form with current values
      const g = response.data.gallery;
      setEditForm({
        title: g.title,
        description: g.description || '',
        eventDate: g.eventDate ? new Date(g.eventDate).toISOString().split('T')[0] : '',
        location: g.location || '',
        category: g.category || '',
      });
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditDetails = () => {
    setIsEditingDetails(true);
  };

  const handleCancelEdit = () => {
    if (gallery) {
      setEditForm({
        title: gallery.title,
        description: gallery.description || '',
        eventDate: gallery.eventDate ? new Date(gallery.eventDate).toISOString().split('T')[0] : '',
        location: gallery.location || '',
        category: gallery.category || '',
      });
    }
    setIsEditingDetails(false);
  };

  const handleSaveDetails = async () => {
    if (!gallery) return;

    try {
      setSavingDetails(true);
      await galleryService.updateGallery(params.id as string, editForm);
      await fetchGallery(params.id as string);
      setIsEditingDetails(false);
    } catch (error) {
      console.error('Error updating gallery:', error);
      alert('Failed to update gallery details');
    } finally {
      setSavingDetails(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setUploading(true);
      await galleryService.uploadPhotos(params.id as string, files);
      await fetchGallery(params.id as string);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Error uploading photos:', error);
      alert('Failed to upload photos');
    } finally {
      setUploading(false);
    }
  };

  const handleSetCoverImage = async (photoId: string) => {
    try {
      await galleryService.setCoverImage(params.id as string, photoId);
      await fetchGallery(params.id as string);
    } catch (error) {
      console.error('Error setting cover image:', error);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      await galleryService.deletePhoto(params.id as string, photoId);
      await fetchGallery(params.id as string);
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  const handleEditCaption = (photo: Photo) => {
    setEditingCaption(photo._id);
    setCaptionText(photo.caption || '');
  };

  const handleSaveCaption = async (photoId: string) => {
    try {
      await galleryService.updatePhotoCaption(params.id as string, photoId, captionText);
      await fetchGallery(params.id as string);
      setEditingCaption(null);
      setCaptionText('');
    } catch (error) {
      console.error('Error updating caption:', error);
    }
  };

  const handleTogglePublish = async () => {
    try {
      await galleryService.togglePublishStatus(params.id as string);
      await fetchGallery(params.id as string);
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-green-700" />
        </div>
      </DashboardLayout>
    );
  }

  if (!gallery) {
    return (
      <DashboardLayout role="admin">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Gallery not found</h2>
          <button
            onClick={() => router.push('/admin/galleries')}
            className="px-6 py-3 bg-green-700 text-white rounded-md font-medium hover:bg-green-800 transition-colors"
          >
            Back to Galleries
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <button
            onClick={() => router.push('/admin/gallery')}
            className="inline-flex items-center gap-2 text-stone-600 hover:text-green-700 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Galleries</span>
          </button>

          {/* Gallery Details Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
            {isEditingDetails ? (
              /* Edit Mode */
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-stone-900">Edit Gallery Details</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveDetails}
                      disabled={savingDetails}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-md font-medium hover:bg-green-800 transition-colors disabled:opacity-50"
                    >
                      {savingDetails ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={savingDetails}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 rounded-md font-medium hover:bg-stone-200 transition-colors disabled:opacity-50"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      value={editForm.eventDate}
                      onChange={(e) => setEditForm({ ...editForm, eventDate: e.target.value })}
                      className="w-full px-4 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Category
                    </label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full px-4 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select category</option>
                      <option value="Events">Events</option>
                      <option value="Community">Community</option>
                      <option value="Projects">Projects</option>
                      <option value="Celebrations">Celebrations</option>
                      <option value="Outreach">Outreach</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      placeholder="e.g., Lagos, Nigeria"
                      className="w-full px-4 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-stone-900">{gallery.title}</h1>
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded ${
                          gallery.isPublished
                            ? 'bg-green-100 text-green-700'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {gallery.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    {gallery.description && (
                      <p className="text-stone-600 mb-4">{gallery.description}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm text-stone-600">
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={16} />
                        {formatDate(gallery.eventDate)}
                      </span>
                      {gallery.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={16} />
                          {gallery.location}
                        </span>
                      )}
                      {gallery.category && (
                        <span className="inline-flex items-center gap-1">
                          <Tag size={16} />
                          {gallery.category}
                        </span>
                      )}
                      <span>🖼️ {gallery.photoCount} photos</span>
                      <span>👁️ {gallery.viewCount} views</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleEditDetails}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 rounded-md font-medium hover:bg-stone-200 transition-colors"
                    >
                      <Edit2 size={18} />
                      Edit Details
                    </button>
                    <button
                      onClick={handleTogglePublish}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-medium transition-colors ${
                        gallery.isPublished
                          ? 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                          : 'bg-green-700 text-white hover:bg-green-800'
                      }`}
                    >
                      {gallery.isPublished ? (
                        <>
                          <EyeOff size={18} />
                          Unpublish
                        </>
                      ) : (
                        <>
                          <Eye size={18} />
                          Publish
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
          <h2 className="text-xl font-bold text-stone-900 mb-4">Upload Photos</h2>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-700 text-white rounded-md font-medium hover:bg-green-800 transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={20} />
                  Select Photos
                </>
              )}
            </button>
            <p className="text-sm text-stone-600">
              Accepted formats: JPEG, PNG, WebP (Max 5MB per file, up to 20 files at once)
            </p>
          </div>
        </div>

        {/* Photos Grid */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
          <h2 className="text-xl font-bold text-stone-900 mb-4">
            Gallery Photos ({gallery.photoCount})
          </h2>

          {gallery.photos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.photos.map((photo) => (
                <div
                  key={photo._id}
                  className="group relative bg-stone-100 rounded-lg overflow-hidden border border-stone-200"
                >
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={photo.url}
                      width={600}
                      height={450}
                      alt={photo.caption || 'Gallery photo'}
                      className="w-full h-full object-cover"
                    />
                    {gallery.coverImage?.publicId === photo.publicId && (
                      <div className="absolute top-3 left-3 px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded flex items-center gap-1">
                        <Star size={12} fill="white" />
                        Cover
                      </div>
                    )}
                  </div>

                  {/* Actions Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleSetCoverImage(photo._id)}
                      className="p-2 bg-white rounded-full hover:bg-amber-500 hover:text-white transition-colors"
                      title="Set as cover"
                    >
                      <Star size={18} />
                    </button>
                    <button
                      onClick={() => handleEditCaption(photo)}
                      className="p-2 bg-white rounded-full hover:bg-blue-500 hover:text-white transition-colors"
                      title="Edit caption"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeletePhoto(photo._id)}
                      className="p-2 bg-white rounded-full hover:bg-red-500 hover:text-white transition-colors"
                      title="Delete photo"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Caption Section */}
                  <div className="p-3 bg-white border-t border-stone-200">
                    {editingCaption === photo._id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={captionText}
                          onChange={(e) => setCaptionText(e.target.value)}
                          placeholder="Enter caption..."
                          className="flex-1 px-2 py-1 text-sm border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveCaption(photo._id)}
                          className="p-1 text-green-700 hover:bg-green-50 rounded"
                        >
                          <Save size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setEditingCaption(null);
                            setCaptionText('');
                          }}
                          className="p-1 text-stone-600 hover:bg-stone-100 rounded"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-stone-600 line-clamp-2">
                        {photo.caption || 'No caption'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-stone-500">
              <Upload className="w-12 h-12 mx-auto mb-3 text-stone-300" />
              <p>No photos yet. Upload some to get started!</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader2, Upload, X } from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import Image from 'next/image';

interface VolunteerCall {
  _id: string;
  title: string;
  description: string;
  requirements: string;
  designImage: {
    url: string;
    publicId: string;
  };
  eventDate: string;
  location: string;
  numberOfVolunteers: number;
  deadline: string;
  category: string;
  status: string;
  isPublished: boolean;
}

export default function EditVolunteerCallPage() {
  const router = useRouter();
  const params = useParams();
  const callId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [originalCall, setOriginalCall] = useState<VolunteerCall | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    eventDate: '',
    location: '',
    numberOfVolunteers: '',
    deadline: '',
    category: 'farm_work' as const,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { value: 'farm_work', label: 'Farm Work' },
    { value: 'event_support', label: 'Event Support' },
    { value: 'community_outreach', label: 'Community Outreach' },
    { value: 'training', label: 'Training' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'other', label: 'Other' },
  ];

  useEffect(() => {
    fetchVolunteerCall();
  }, [callId]);

  const fetchVolunteerCall = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/volunteer-calls/${callId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch volunteer call');
      }

      if (data.success) {
        const call = data.data.call;
        setOriginalCall(call);
        
        // Format dates for input fields (YYYY-MM-DD)
        const formatDateForInput = (dateString: string) => {
          return new Date(dateString).toISOString().split('T')[0];
        };

        setFormData({
          title: call.title,
          description: call.description,
          requirements: call.requirements,
          eventDate: formatDateForInput(call.eventDate),
          location: call.location,
          numberOfVolunteers: call.numberOfVolunteers.toString(),
          deadline: formatDateForInput(call.deadline),
          category: call.category,
        });

        setImagePreview(call.designImage.url);
      }
    } catch (error: any) {
      console.error('Error fetching volunteer call:', error);
      alert(error.message || 'Failed to load volunteer call');
      router.push('/admin/volunteer-calls');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, designImage: 'Please select an image file' }));
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, designImage: 'Image must be less than 5MB' }));
      return;
    }

    setImageFile(file);
    setErrors((prev) => ({ ...prev, designImage: '' }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    if (originalCall) {
      // Revert to original image
      setImageFile(null);
      setImagePreview(originalCall.designImage.url);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.requirements.trim()) newErrors.requirements = 'Requirements are required';
    if (!formData.eventDate) newErrors.eventDate = 'Event date is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.numberOfVolunteers || parseInt(formData.numberOfVolunteers) < 1) {
      newErrors.numberOfVolunteers = 'Number of volunteers must be at least 1';
    }
    if (!formData.deadline) newErrors.deadline = 'Deadline is required';

    // Validate deadline is before event date
    if (formData.deadline && formData.eventDate) {
      if (new Date(formData.deadline) >= new Date(formData.eventDate)) {
        newErrors.deadline = 'Deadline must be before event date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('requirements', formData.requirements);
      formDataToSend.append('eventDate', formData.eventDate);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('numberOfVolunteers', formData.numberOfVolunteers);
      formDataToSend.append('deadline', formData.deadline);
      formDataToSend.append('category', formData.category);
      
      // Only append image if a new one was selected
      if (imageFile) {
        formDataToSend.append('designImage', imageFile);
      }

      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/volunteer-calls/${callId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update volunteer call');
      }

      router.push(`/admin/volunteer-calls/${callId}`);
    } catch (error: any) {
      console.error('Error updating volunteer call:', error);
      alert(error.message || 'Failed to update volunteer call');
    } finally {
      setSubmitting(false);
    }
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

  return (
    <DashboardLayout role="admin">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-stone-600 hover:text-green-700 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back</span>
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-stone-900 mb-2">Edit Volunteer Call</h1>
            <p className="text-stone-600">
              Update the volunteer call details. Changes will be reflected immediately.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Design Image Upload */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Design Image
              </label>
              
              <div className="relative rounded-lg overflow-hidden border border-stone-200">
                {imagePreview && (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={800}
                    height={400}
                    className="w-full h-64 object-cover"
                  />
                )}
                
                <div className="absolute inset-0 bg-opacity-50 hover:bg-opacity-40 transition-all flex items-center justify-center group">
                  <input
                    type="file"
                    id="designImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="designImage"
                    className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <div className="bg-white px-4 py-2 rounded-md flex items-center gap-2 font-medium text-stone-700 hover:bg-stone-50">
                      <Upload size={18} />
                      Change Image
                    </div>
                  </label>
                </div>

                {imageFile && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
              
              {errors.designImage && (
                <p className="text-red-500 text-sm mt-1">{errors.designImage}</p>
              )}
              <p className="text-xs text-stone-500 mt-1">
                {imageFile ? 'New image will replace the current one' : 'Click on the image to change it'}
              </p>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-stone-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Volunteers Needed for Farm Harvest"
                className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.title ? 'border-red-500' : 'border-stone-300'
                }`}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-stone-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the volunteer opportunity, what volunteers will be doing, and why their help is needed..."
                className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none ${
                  errors.description ? 'border-red-500' : 'border-stone-300'
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Requirements */}
            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-stone-700 mb-2">
                Requirements <span className="text-red-500">*</span>
              </label>
              <textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows={4}
                placeholder="List the requirements, skills, or qualifications needed (e.g., physical fitness, specific skills, age requirements)..."
                className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none ${
                  errors.requirements ? 'border-red-500' : 'border-stone-300'
                }`}
              />
              {errors.requirements && (
                <p className="text-red-500 text-sm mt-1">{errors.requirements}</p>
              )}
            </div>

            {/* Location and Category */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-stone-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Ibiteinye Integrated Farms"
                  className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.location ? 'border-red-500' : 'border-stone-300'
                  }`}
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                )}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-stone-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Number of Volunteers and Event Date */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="numberOfVolunteers" className="block text-sm font-medium text-stone-700 mb-2">
                  Number of Volunteers Needed <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="numberOfVolunteers"
                  name="numberOfVolunteers"
                  min="1"
                  value={formData.numberOfVolunteers}
                  onChange={handleChange}
                  placeholder="e.g., 20"
                  className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.numberOfVolunteers ? 'border-red-500' : 'border-stone-300'
                  }`}
                />
                {errors.numberOfVolunteers && (
                  <p className="text-red-500 text-sm mt-1">{errors.numberOfVolunteers}</p>
                )}
              </div>

              <div>
                <label htmlFor="eventDate" className="block text-sm font-medium text-stone-700 mb-2">
                  Event Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="eventDate"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.eventDate ? 'border-red-500' : 'border-stone-300'
                  }`}
                />
                {errors.eventDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.eventDate}</p>
                )}
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-stone-700 mb-2">
                Application Deadline <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.deadline ? 'border-red-500' : 'border-stone-300'
                }`}
              />
              {errors.deadline && (
                <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>
              )}
              <p className="text-xs text-stone-500 mt-1">
                Applications will be closed after this date
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-700 text-white rounded-md font-medium hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Updating...
                  </>
                ) : (
                  'Update Volunteer Call'
                )}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                disabled={submitting}
                className="px-6 py-3 border border-stone-300 text-stone-700 rounded-md font-medium hover:bg-stone-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
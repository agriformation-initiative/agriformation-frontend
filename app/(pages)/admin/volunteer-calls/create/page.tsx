/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Upload, X } from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import Image from 'next/image';

export default function CreateVolunteerCallPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
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
    setImageFile(null);
    setImagePreview(null);
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
    if (!imageFile) newErrors.designImage = 'Design image is required';

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
      setLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('requirements', formData.requirements);
      formDataToSend.append('eventDate', formData.eventDate);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('numberOfVolunteers', formData.numberOfVolunteers);
      formDataToSend.append('deadline', formData.deadline);
      formDataToSend.append('category', formData.category);
      if (imageFile) {
        formDataToSend.append('designImage', imageFile);
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/volunteer-calls`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create volunteer call');
      }

      router.push('/admin/volunteer-calls');
    } catch (error: any) {
      console.error('Error creating volunteer call:', error);
      alert(error.message || 'Failed to create volunteer call');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="max-w-4xl">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-stone-600 hover:text-green-700 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back</span>
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-stone-900 mb-2">Create Volunteer Call</h1>
            <p className="text-stone-600">
              Create a new call for volunteers. Add an eye-catching design and all necessary details.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Design Image Upload */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Design Image <span className="text-red-500">*</span>
              </label>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed border-stone-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
                  <input
                    type="file"
                    id="designImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="designImage"
                    className="cursor-pointer flex flex-col items-center gap-3"
                  >
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                      <Upload className="text-green-700" size={28} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-stone-700">
                        Click to upload design image
                      </p>
                      <p className="text-xs text-stone-500 mt-1">
                        PNG, JPG, WEBP up to 5MB
                      </p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="relative rounded-lg overflow-hidden border border-stone-200">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={800}
                    height={400}
                    className="w-full h-64 object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
              
              {errors.designImage && (
                <p className="text-red-500 text-sm mt-1">{errors.designImage}</p>
              )}
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
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-700 text-white rounded-md font-medium hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Creating...
                  </>
                ) : (
                  'Create Volunteer Call'
                )}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-stone-300 text-stone-700 rounded-md font-medium hover:bg-stone-50 transition-colors"
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
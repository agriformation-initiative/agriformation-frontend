import { Key, ReactNode } from "react";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'superadmin' | 'admin' | 'volunteer';
  phoneNumber?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface Volunteer {
  firstName: ReactNode;
  _id: string;
  user: User | string;
  preferredRole: string;
  aboutYourself: string;
  skills?: string[];
  availability?: string;
  location?: {
    state: string;
    lga: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'on-hold';
  reviewedBy?: User;
  reviewedAt?: string;
  reviewNotes?: string;
  assignedPrograms?: Program[];
  hoursContributed: number;
  certificatesIssued?: Certificate[];
  createdAt: string;
  updatedAt: string;
}

export interface VolunteerApplication {
  _id: string;
  fullName: string;
  email: string;
  preferredRole: string;
  aboutYourself: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  processedBy?: User;
  processedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Program {
  id: Key | null | undefined;
  programName: string;
  role: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'paused';
}

export interface Certificate {
  title: string;
  issuedDate: string;
  fileUrl: string;
}

export interface DashboardStats {
  totalVolunteers: number;
  activeVolunteers: number;
  pendingApplications: number;
  totalHoursContributed: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    applications(applications: any): unknown;
    items: T[];
    totalPages: number;
    currentPage: number;
    total: number;
  };
}

// Add these to your existing types/indexes.ts file

export interface Photo {
  _id: string;
  url: string;
  publicId: string;
  caption?: string;
  order: number;
  uploadedAt: string;
}

export interface CoverImage {
  url: string;
  publicId: string;
}

export interface Gallery {
  _id: string;
  title: string;
  description: string;
  coverImage?: CoverImage;
  eventDate: string;
  location?: string;
  category: 'farm_excursion' | 'workshop' | 'community_event' | 'training' | 'other';
  photos: Photo[];
  isPublished: boolean;
  viewCount: number;
  photoCount: number; // Virtual field
  createdBy: string | User;
  lastUpdatedBy?: string | User;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryStats {
  totalGalleries: number;
  publishedGalleries: number;
  totalPhotos: number;
  totalViews: number;
  categoryCounts: Array<{
    _id: string;
    count: number;
  }>;
}

// For create/update operations
export interface CreateGalleryData {
  title: string;
  description: string;
  eventDate: string;
  location?: string;
  category?: Gallery['category'];
}

export interface UpdateGalleryData {
  title?: string;
  description?: string;
  eventDate?: string;
  location?: string;
  category?: Gallery['category'];
}

export interface PhotoOrder {
  photoId: string;
  order: number;
}
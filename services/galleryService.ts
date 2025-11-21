import api from '@/lib/auth';
import {
  ApiResponse,
  PaginatedResponse,
  Gallery,
  GalleryStats,
} from '@/types/indexes';

export const galleryService = {
  // ============================================
  // PUBLIC ENDPOINTS
  // ============================================

  // Get all published galleries
  async getPublishedGalleries(params?: {
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Gallery>> {
    const response = await api.get('/galleries/public', { params });
    return response.data;
  },

  // Get featured galleries
  async getFeaturedGalleries(): Promise<ApiResponse<{ galleries: Gallery[] }>> {
    const response = await api.get('/galleries/public/featured');
    return response.data;
  },

  // Get galleries by category
  async getGalleriesByCategory(
    category: string,
    params?: { page?: number; limit?: number }
  ): Promise<PaginatedResponse<Gallery>> {
    const response = await api.get(`/galleries/public/category/${category}`, { params });
    return response.data;
  },

  // Get single gallery details (public)
  async getGalleryById(id: string): Promise<ApiResponse<{ gallery: Gallery }>> {
    const response = await api.get(`/galleries/public/${id}`);
    return response.data;
  },

  // ============================================
  // ADMIN ENDPOINTS
  // ============================================

  // Get gallery statistics
  async getGalleryStats(): Promise<ApiResponse<{ stats: GalleryStats }>> {
    const response = await api.get('/galleries/stats');
    return response.data;
  },

  // Get all galleries (admin view) - FIXED TYPE
  async getAllGalleries(params?: {
    category?: string;
    isPublished?: boolean;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ galleries: Gallery[] }>> {
    const response = await api.get('/galleries', { params });
    return response.data;
  },

  // Get single gallery details (admin view)
  async getGalleryDetails(id: string): Promise<ApiResponse<{ gallery: Gallery }>> {
    const response = await api.get(`/galleries/${id}`);
    return response.data;
  },

  // Create new gallery
  async createGallery(data: {
    title: string;
    description: string;
    eventDate: string;
    location?: string;
    category?: string;
  }): Promise<ApiResponse<{ gallery: Gallery }>> {
    const response = await api.post('/galleries', data);
    return response.data;
  },

  // Update gallery details
  async updateGallery(
    id: string,
    data: {
      title?: string;
      description?: string;
      eventDate?: string;
      location?: string;
      category?: string;
    }
  ): Promise<ApiResponse<{ gallery: Gallery }>> {
    const response = await api.put(`/galleries/${id}`, data);
    return response.data;
  },

  // Delete gallery
  async deleteGallery(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await api.delete(`/galleries/${id}`);
    return response.data;
  },

  // Upload photos to gallery
  async uploadPhotos(galleryId: string, files: File[]) {
    const formData = new FormData();
    
    // Append each file to the FormData
    files.forEach((file) => {
      formData.append('photos', file);
    });
    
    const response = await api.post(
      `/galleries/${galleryId}/photos`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  },

  // Update photo caption
  async updatePhotoCaption(
    galleryId: string,
    photoId: string,
    caption: string
  ): Promise<ApiResponse<{ gallery: Gallery }>> {
    const response = await api.put(`/galleries/${galleryId}/photos/${photoId}`, {
      caption,
    });
    return response.data;
  },

  // Reorder photos in gallery
  async reorderPhotos(
    id: string,
    photoOrders: Array<{ photoId: string; order: number }>
  ): Promise<ApiResponse<{ gallery: Gallery }>> {
    const response = await api.put(`/galleries/${id}/photos/reorder`, {
      photoOrders,
    });
    return response.data;
  },

  // Delete photo from gallery
  async deletePhoto(
    galleryId: string,
    photoId: string
  ): Promise<ApiResponse<{ gallery: Gallery }>> {
    const response = await api.delete(`/galleries/${galleryId}/photos/${photoId}`);
    return response.data;
  },

  // Set cover image for gallery
  async setCoverImage(
    id: string,
    photoId: string
  ): Promise<ApiResponse<{ gallery: Gallery }>> {
    const response = await api.put(`/galleries/${id}/cover`, { photoId });
    return response.data;
  },

  // Publish/Unpublish gallery
  async togglePublishStatus(id: string): Promise<ApiResponse<{ gallery: Gallery }>> {
    const response = await api.put(`/galleries/${id}/publish`);
    return response.data;
  },
};
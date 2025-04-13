import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

export interface UploadResponse {
  imageUrl: string;
  publicId: string;
}

export const imageService = {
  async uploadImage(file: File, caption?: string) {
    const formData = new FormData();
    formData.append('image', file);
    if (caption) {
      formData.append('caption', caption);
    }

    const response = await axios.post<UploadResponse>(
      `${API_URL}/images/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  },

  async deleteImage(publicId: string) {
    await axios.delete(`${API_URL}/images/${publicId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },

  async getFeed() {
    const response = await axios.get(`${API_URL}/images/feed`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },
}; 
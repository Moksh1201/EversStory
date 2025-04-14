import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8002/images';

export interface UploadResponse {
  imageUrl: string;
  publicId: string;
}

export const imageService = {
  async uploadImage(formData: FormData) {
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
    const response = await axios.get(`${API_URL}/feed`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data.map((post: any) => ({
      ...post,
      imageUrl: post.image_url,
      id: post._id || Math.random().toString(36).substr(2, 9),
      likesCount: post.likesCount || 0,
      commentsCount: post.commentsCount || 0,
      createdAt: post.created_at || new Date().toISOString(),
      user: {
        username: post.user_id || 'Unknown User',
        profilePicture: null
      }
    }));
  },
};

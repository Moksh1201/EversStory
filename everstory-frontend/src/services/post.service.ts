import axios from 'axios';
import { useAuthStore } from '../store/auth.store';

const POST_API_URL = 'http://localhost:8002';

export interface Post {
  id: string;
  content: string;
  author: string;
  likes: number;
  comments: number;
  timestamp: string;
  imageUrl?: string;
}

class PostService {
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  private getUserId() {
    return useAuthStore.getState().user?.id;
  }

  async createPost(image: File) {
    const formData = new FormData();
    formData.append('file', image);

    const userId = this.getUserId();
    if (userId) {
      formData.append('user_id', userId);
    }

    const response = await axios.post(
      `${POST_API_URL}/images/posts`,
      formData,
      {
        headers: {
          ...this.getAuthHeader(),
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  async uploadImage(image: File) {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('user_id', localStorage.getItem('email') || '');

    const response = await axios.post(
      `${POST_API_URL}/images/upload/`,
      formData,
      {
        headers: {
          ...this.getAuthHeader(),
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  async getPosts() {
    const response = await axios.get<Post[]>(
      `${POST_API_URL}/images/posts`,
      { headers: this.getAuthHeader() }
    );
    return response.data;
  }

  async likePost(postId: string) {
    const response = await axios.post(
      `${POST_API_URL}/images/posts/${postId}/like`,
      {},
      { headers: this.getAuthHeader() }
    );
    return response.data;
  }

  async unlikePost(postId: string) {
    const response = await axios.post(
      `${POST_API_URL}/images/posts/${postId}/unlike`,
      {},
      { headers: this.getAuthHeader() }
    );
    return response.data;
  }

  async addComment(postId: string, content: string) {
    const response = await axios.post(
      `${POST_API_URL}/images/posts/${postId}/comments`,
      { content },
      { headers: this.getAuthHeader() }
    );
    return response.data;
  }
}

export const postService = new PostService();

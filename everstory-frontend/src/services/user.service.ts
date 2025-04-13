import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  profilePicture?: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  posts: Post[];
}

export interface Post {
  id: string;
  imageUrl: string;
  caption?: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

export const userService = {
  async getUserProfile(username: string) {
    const response = await axios.get(`${API_URL}/users/${username}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  async followUser(userId: string) {
    const response = await axios.post(
      `${API_URL}/users/${userId}/follow`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  },

  async unfollowUser(userId: string) {
    const response = await axios.post(
      `${API_URL}/users/${userId}/unfollow`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  },

  async searchUsers(query: string) {
    const response = await axios.get(`${API_URL}/users/search?q=${query}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },
}; 
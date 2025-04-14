import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';
const FRIENDSHIP_API_URL = import.meta.env.VITE_FRIENDSHIP_API_URL || 'http://localhost:8003';

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

export interface User {
  id: string;
  username: string;
  profilePicture?: string;
  isFollowing?: boolean;
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

  async getSuggestions() {
    const response = await axios.get(`${API_URL}/auth/users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  async followUser(userId: string) {
    const response = await axios.post(
      `${FRIENDSHIP_API_URL}/request`,
      { accepter: userId },
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
      `${FRIENDSHIP_API_URL}/unfollow`,
      { accepter: userId },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  }
}; 
import axios from 'axios';
import { User } from './auth.service';

const FRIENDSHIP_API_URL = 'http://localhost:8003';
const API_URL = 'http://localhost:8003'; // Assuming same base for other endpoints

export interface FriendshipRequest {
  requester: string;
  accepter: string;
}

export interface FriendshipResponse {
  id: string;
  requester: string;
  accepter: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface FriendListResponse {
  friends: FriendshipResponse[];
}

class FriendshipService {
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async sendFriendRequest(accepter: string) {
    const requester = localStorage.getItem('email');
    if (!requester) throw new Error('User not authenticated');

    const response = await axios.post(
      `${FRIENDSHIP_API_URL}/request`,
      { requester, accepter },
      { headers: this.getAuthHeader() }
    );
    return response.data;
  }

  async acceptFriendRequest(requester: string) {
    const accepter = localStorage.getItem('email');
    if (!accepter) throw new Error('User not authenticated');

    const response = await axios.post(
      `${FRIENDSHIP_API_URL}/accept`,
      { requester, accepter },
      { headers: this.getAuthHeader() }
    );
    return response.data;
  }

  async rejectFriendRequest(requester: string) {
    const accepter = localStorage.getItem('email');
    if (!accepter) throw new Error('User not authenticated');

    const response = await axios.post(
      `${FRIENDSHIP_API_URL}/reject`,
      { requester, accepter },
      { headers: this.getAuthHeader() }
    );
    return response.data;
  }

  async getFriends(userId: string) {
    const response = await axios.get<FriendListResponse>(
      `${FRIENDSHIP_API_URL}/friends/${userId}`,
      { headers: this.getAuthHeader() }
    );
    return response.data;
  }

  async cancelFriendRequest(accepter: string) {
    const requester = localStorage.getItem('email');
    if (!requester) throw new Error('User not authenticated');

    const response = await axios.post(
      `${FRIENDSHIP_API_URL}/cancel-request`,
      { requester, accepter },
      { headers: this.getAuthHeader() }
    );
    return response.data;
  }

  async unfollow(userId: string) {
    const currentUser = localStorage.getItem('email');
    if (!currentUser) throw new Error('User not authenticated');

    const response = await axios.post(
      `${FRIENDSHIP_API_URL}/unfollow`,
      { requester: currentUser, accepter: userId },
      { headers: this.getAuthHeader() }
    );
    return response.data;
  }

  // ✅ New methods added below

  async followUser(userId: string) {
    await axios.post(
      `${API_URL}/follow/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
  }

  async unfollowUser(userId: string) {
    await axios.post(
      `${API_URL}/users/unfollow/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
  }

  async searchUsers(query: string) {
    const response = await axios.get(`${API_URL}/users/search?q=${query}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  }
}

export const friendshipService = new FriendshipService();

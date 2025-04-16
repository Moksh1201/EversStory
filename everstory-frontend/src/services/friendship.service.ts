import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { User } from './user.service';

const FRIENDSHIP_API_URL = 'http://localhost:8003';

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
    if (!token) {
      throw new Error('No authentication token found');
    }
    return { Authorization: `Bearer ${token}` };
  }

  private getCurrentEmail(): string {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded.sub;
    } catch (err) {
      throw new Error('Invalid token format');
    }
  }

  async sendFriendRequest(accepter: string) {
    const requester = this.getCurrentEmail();
    const payload = { requester, accepter };
  
    console.log('Sending friend request with payload:', payload);
    console.log('Using auth header:', this.getAuthHeader());
  
    try {
      const { data } = await axios.post(
        `${FRIENDSHIP_API_URL}/request`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            ...this.getAuthHeader(),
          },
        }
      );
      console.log('Friend request successful:', data);
      return data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Unknown error occurred';
      console.error('sendFriendRequest error:', {
        message: errorMessage,
        status: err?.response?.status,
        data: err?.response?.data
      });
      throw new Error(errorMessage);
    }
  }
  
  
  

  async acceptFriendRequest(requester: string) {
    const accepter = this.getCurrentEmail();
    return axios.post(`${FRIENDSHIP_API_URL}/accept`, { requester, accepter }, {
      headers: this.getAuthHeader()
    }).then(res => res.data);
  }

  async rejectFriendRequest(requester: string) {
    const accepter = this.getCurrentEmail();
    return axios.post(`${FRIENDSHIP_API_URL}/reject`, { requester, accepter }, {
      headers: this.getAuthHeader()
    }).then(res => res.data);
  }

  async cancelFriendRequest(accepter: string) {
    const requester = this.getCurrentEmail();
    return axios.post(`${FRIENDSHIP_API_URL}/cancel-request`, { requester, accepter }, {
      headers: this.getAuthHeader()
    }).then(res => res.data);
  }

  async getFriends(userId: string) {
    const response = await axios.get<FriendListResponse>(
      `${FRIENDSHIP_API_URL}/friends/${userId}`,
      { headers: this.getAuthHeader() }
    );
    return response.data;
  }

  async getPendingRequests(userId: string) {
    const response = await axios.get<FriendListResponse>(
      `${FRIENDSHIP_API_URL}/pending/${userId}`,
      { headers: this.getAuthHeader() }
    );
    return response.data;
  }

  async getFriendRequests() {
    const currentUser = this.getCurrentEmail();
    try {
      const response = await axios.get(
        `${FRIENDSHIP_API_URL}/pending-requests/${currentUser}`,
        { headers: this.getAuthHeader() }
      );
      return response.data.friends.map((request: any) => ({
        id: request.id,
        email: request.requester,
        username: request.username,
        status: request.status,
        createdAt: request.created_at,
        updatedAt: request.updated_at
      }));
    } catch (err: any) {
      console.error('Error fetching friend requests:', err);
      throw new Error(err?.response?.data?.detail || 'Failed to fetch friend requests');
    }
  }

  async unfollowUser(accepter: string) {
    const requester = this.getCurrentEmail();
    try {
      const { data } = await axios.post(
        `${FRIENDSHIP_API_URL}/unfollow`,
        { requester, accepter },
        {
          headers: {
            'Content-Type': 'application/json',
            ...this.getAuthHeader(),
          },
        }
      );
      return data;
    } catch (err: any) {
      console.error('unfollowUser error:', err?.response?.data || err.message);
      throw err;
    }
  }
}

export const friendshipService = new FriendshipService();

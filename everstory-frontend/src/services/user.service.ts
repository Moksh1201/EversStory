// import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';
// const FRIENDSHIP_API_URL = import.meta.env.VITE_FRIENDSHIP_API_URL || 'http://localhost:8003';

// export interface UserProfile {
//   id: string;
//   username: string;
//   fullName: string;
//   profilePicture?: string;
//   bio?: string;
//   followersCount: number;
//   followingCount: number;
//   isFollowing: boolean;
//   posts: Post[];
// }

// export interface Post {
//   id: string;
//   imageUrl: string;
//   caption?: string;
//   likesCount: number;
//   commentsCount: number;
//   createdAt: string;
// }

// export interface User {
//   id: string;
//   username: string;
//   email: string;
//   profilePicture?: string;
//   isFollowing?: boolean;
// }

// export const userService = {
//   async getUserProfile(username: string) {
//     const response = await axios.get(`${API_URL}/users/${username}`, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('token')}`,
//       },
//     });
//     return response.data;
//   },

//   async getCurrentUser() {
//     try {
//       const response = await axios.get(`${API_URL}/auth/me`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching current user:', error);
//       throw error;
//     }
//   },

//   async getSuggestions() {
//     const response = await axios.get(`${API_URL}/auth/users`, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('token')}`,
//       },
//     });
//     return response.data;
//   },

//   async followUser(userId: string) {
//     try {
//       // Get current user's email from token
//       const currentUser = await this.getCurrentUser();
//       console.log('Current user:', currentUser);
      
//       // Get target user's email from suggestions data
//       const suggestions = await this.getSuggestions();
//       const targetUser = suggestions.find(user => user.id === userId);
      
//       if (!targetUser) {
//         throw new Error('Target user not found');
//       }
      
//       console.log('Target user:', targetUser);

//       const requestData = {
//         requester: currentUser.email,
//         accepter: targetUser.email
//       };
      
//       console.log('Sending follow request with data:', requestData);
      
//       const response = await axios.post(
//         `${FRIENDSHIP_API_URL}/request`,
//         requestData,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         }
//       );
//       console.log('Follow response:', response.data);
//       return response.data;
//     } catch (error) {
//       console.error('Error following user:', error);
//       throw error;
//     }
//   },

//   async unfollowUser(userId: string) {
//     try {
//       // Get current user's email from token
//       const currentUser = await this.getCurrentUser();
//       console.log('Current user:', currentUser);
      
//       // Get target user's email from suggestions data
//       const suggestions = await this.getSuggestions();
//       const targetUser = suggestions.find(user => user.id === userId);
      
//       if (!targetUser) {
//         throw new Error('Target user not found');
//       }
      
//       console.log('Target user:', targetUser);

//       const requestData = {
//         requester: currentUser.email,
//         accepter: targetUser.email
//       };
      
//       console.log('Sending unfollow request with data:', requestData);
      
//       const response = await axios.post(
//         `${FRIENDSHIP_API_URL}/unfollow`,
//         requestData,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         }
//       );
//       console.log('Unfollow response:', response.data);
//       return response.data;
//     } catch (error) {
//       console.error('Error unfollowing user:', error);
//       throw error;
//     }
//   }
// }; 

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

export interface User {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
  isFollowing?: boolean;
}

export const userService = {
  async getUserProfile(username: string): Promise<UserProfile> {
    const response = await axios.get<UserProfile>(`${API_URL}/users/${username}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await axios.get<User>(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },

  async getSuggestions(): Promise<User[]> {
    const response = await axios.get<User[]>(`${API_URL}/auth/users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },
};



export const { getUserProfile, getCurrentUser, getSuggestions } = userService;
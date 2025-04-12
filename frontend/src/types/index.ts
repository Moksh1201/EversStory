export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  followers: number;
  following: number;
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  createdAt: string;
  isPrivate: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}
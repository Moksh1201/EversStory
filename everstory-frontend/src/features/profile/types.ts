import { Post } from "@/features/posts/types";

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  posts: Post[];
}

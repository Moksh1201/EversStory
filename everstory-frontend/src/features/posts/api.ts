import axios from "@/services/axios";
import { Post } from "./types";

export const fetchPosts = async (page = 1): Promise<Post[]> => {
  const res = await axios.get(`/posts?page=${page}`);
  return res.data.posts;
};

export const createPost = async (formData: FormData): Promise<Post> => {
  const res = await axios.post("/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.post;
};

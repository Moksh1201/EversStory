import axios from "@/services/axios";
import { Friend, FollowStatus } from "./types";

export const getFriendList = async (): Promise<Friend[]> => {
  const res = await axios.get("/friends");
  return res.data.friends;
};

export const getFollowStatus = async (userId: string): Promise<FollowStatus> => {
  const res = await axios.get(`/friends/status/${userId}`);
  return res.data;
};

export const followUser = async (userId: string) => {
  await axios.post(`/friends/follow`, { userId });
};

export const unfollowUser = async (userId: string) => {
  await axios.post(`/friends/unfollow`, { userId });
};

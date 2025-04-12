import axios from "@/services/axios";
import { UserProfile } from "./types";

export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  const res = await axios.get(`/users/${userId}`);
  return res.data.profile;
};

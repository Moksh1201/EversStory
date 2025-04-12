import { UserProfile } from "./types";
import { FollowButton } from "@/features/friends/FollowButton";

export const UserInfo = ({ profile }: { profile: UserProfile }) => {
  return (
    <div className="flex items-center justify-between border-b pb-4 mb-4">
      <div>
        <h2 className="text-xl font-bold">{profile.name}</h2>
        <p className="text-sm text-gray-600">{profile.email}</p>
        {profile.bio && <p className="mt-1">{profile.bio}</p>}
      </div>
      <FollowButton userId={profile._id} />
    </div>
  );
};

import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "./api";
import { UserInfo } from "./UserInfo";
import { PostCard } from "@/features/posts/PostCard";

export const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", id],
    queryFn: () => getUserProfile(id!),
  });

  if (isLoading) return <p>Loading profile...</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-6 mt-6">
      {profile && (
        <>
          <UserInfo profile={profile} />
          <div className="grid grid-cols-1 gap-4">
            {profile.posts.length > 0 ? (
              profile.posts.map((post) => <PostCard key={post._id} post={post} />)
            ) : (
              <p>This user hasn’t posted anything yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { userService, UserProfile } from '../../services/user.service';
import { FaUserPlus, FaUserMinus, FaUser } from 'react-icons/fa';

export const UserProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const data = await userService.getUserProfile(username!);
        setProfile(data);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const handleFollow = async () => {
    if (!profile) return;
    try {
      if (profile.isFollowing) {
        await userService.unfollowUser(profile.id);
        setProfile((prev) => prev ? {
          ...prev,
          isFollowing: false,
          followersCount: prev.followersCount - 1,
        } : null);
      } else {
        await userService.followUser(profile.id);
        setProfile((prev) => prev ? {
          ...prev,
          isFollowing: true,
          followersCount: prev.followersCount + 1,
        } : null);
      }
    } catch (err) {
      setError('Failed to update follow status');
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error || !profile) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center space-x-8 mb-8">
        <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden">
          {profile.profilePicture ? (
            <img
              src={profile.profilePicture}
              alt={profile.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
              <FaUser />
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-4">
            <h1 className="text-2xl font-semibold">{profile.username}</h1>
            <button
              onClick={handleFollow}
              className={`btn-${profile.isFollowing ? 'secondary' : 'primary'}`}
            >
              {profile.isFollowing ? (
                <>
                  <FaUserMinus className="inline mr-2" />
                  Unfollow
                </>
              ) : (
                <>
                  <FaUserPlus className="inline mr-2" />
                  Follow
                </>
              )}
            </button>
          </div>

          <div className="flex space-x-8 mb-4">
            <div>
              <span className="font-semibold">{profile.posts.length}</span> posts
            </div>
            <div>
              <span className="font-semibold">{profile.followersCount}</span> followers
            </div>
            <div>
              <span className="font-semibold">{profile.followingCount}</span> following
            </div>
          </div>

          <div>
            <h2 className="font-semibold">{profile.fullName}</h2>
            {profile.bio && <p className="text-gray-600">{profile.bio}</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1">
        {profile.posts.map((post) => (
          <div key={post.id} className="aspect-square">
            <img
              src={post.imageUrl}
              alt={post.caption || 'Post'}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}; 
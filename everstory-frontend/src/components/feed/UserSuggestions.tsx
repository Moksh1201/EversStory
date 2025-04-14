import { useEffect, useState } from 'react';
import { userService, User } from '../../services/user.service';
import { FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';

export const UserSuggestions = () => {
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingFollows, setPendingFollows] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setIsLoading(true);
        const data = await userService.getSuggestions();
        setSuggestions(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setError('Failed to load suggestions');
        // Keep existing suggestions if any
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  const handleFollow = async (userId: string) => {
    try {
      // Add to pending follows immediately
      setPendingFollows(prev => new Set(prev).add(userId));
      
      // Optimistically update the UI
      setSuggestions(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, isFollowing: true }
            : user
        )
      );
      
      await userService.followUser(userId);
      toast.success('Followed successfully');
    } catch (err) {
      console.error('Error following user:', err);
      // Revert the optimistic update
      setSuggestions(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, isFollowing: false }
            : user
        )
      );
      toast.error('Failed to follow user');
    } finally {
      // Remove from pending follows
      setPendingFollows(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handleUnfollow = async (userId: string) => {
    try {
      // Add to pending follows immediately
      setPendingFollows(prev => new Set(prev).add(userId));
      
      // Optimistically update the UI
      setSuggestions(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, isFollowing: false }
            : user
        )
      );
      
      await userService.unfollowUser(userId);
      toast.success('Unfollowed successfully');
    } catch (err) {
      console.error('Error unfollowing user:', err);
      // Revert the optimistic update
      setSuggestions(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, isFollowing: true }
            : user
        )
      );
      toast.error('Failed to unfollow user');
    } finally {
      // Remove from pending follows
      setPendingFollows(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  if (isLoading && suggestions.length === 0) {
    return <div className="text-center py-4">Loading suggestions...</div>;
  }

  if (error && suggestions.length === 0) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (suggestions.length === 0) {
    return <div className="text-center py-4 text-gray-500">No suggestions available</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Suggestions For You</h2>
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      <div className="space-y-4">
        {suggestions.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FaUser />
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold">{user.username}</p>
              </div>
            </div>
            <button
              onClick={() => user.isFollowing ? handleUnfollow(user.id) : handleFollow(user.id)}
              disabled={pendingFollows.has(user.id)}
              className={`text-sm px-3 py-1 rounded ${
                user.isFollowing
                  ? 'bg-gray-200 text-gray-700'
                  : 'bg-blue-500 text-white'
              } ${pendingFollows.has(user.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {pendingFollows.has(user.id) 
                ? '...' 
                : user.isFollowing 
                  ? 'Unfollow' 
                  : 'Follow'
              }
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}; 
import { useEffect, useState } from 'react';
import { imageService } from '../../services/image.service';
import { FaHeart, FaComment, FaBookmark } from 'react-icons/fa';
import { UserSuggestions } from './UserSuggestions';

interface Post {
  id: string;
  imageUrl: string;
  caption?: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  user: {
    username: string;
    profilePicture?: string;
  };
}

export const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setIsLoading(true);
        const data = await imageService.getFeed();
        setPosts(data);
      } catch (err) {
        setError('Failed to load feed');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeed();
  }, []);

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No posts yet. Follow some users to see their posts here!
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {posts.map((post) => (
            <div key={post.id} className="card mb-8">
              <div className="p-4 flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                  {post.user?.profilePicture ? (
                    <img
                      src={post.user.profilePicture}
                      alt={post.user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      {post.user?.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                <span className="font-semibold">{post.user?.username || 'Unknown User'}</span>
              </div>

              <img
                src={post.imageUrl}
                alt={post.caption || 'Post'}
                className="w-full aspect-square object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/500x500?text=Image+Not+Available';
                }}
              />

              <div className="p-4 space-y-4">
                <div className="flex items-center space-x-4">
                  <button className="text-2xl">
                    <FaHeart />
                  </button>
                  <button className="text-2xl">
                    <FaComment />
                  </button>
                  <button className="text-2xl ml-auto">
                    <FaBookmark />
                  </button>
                </div>

                <div>
                  <p className="font-semibold">{post.likesCount} likes</p>
                  <p>
                    <span className="font-semibold">{post.user?.username}</span>{' '}
                    {post.caption}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="hidden md:block">
          <UserSuggestions />
        </div>
      </div>
    </div>
  );
}; 
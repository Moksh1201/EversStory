import React, { useState, useRef } from 'react';
import { useAuthStore } from '../store/auth.store';
import { Post } from './Post';
import { UserSuggestions } from './UserSuggestions';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarImage } from './ui/avatar';
import { ImageIcon } from './icons/ImageIcon';
import { postService } from '../services/post.service';
import { toast } from 'sonner';

export const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    loadPosts();
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = async () => {
    if (!selectedImage) {
      toast.error('Please select an image');
      return;
    }

    try {
      setIsLoading(true);
      const response = await postService.uploadImage(selectedImage);
      if (response) {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        await loadPosts();
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const loadPosts = async () => {
    try {
      const fetchedPosts = await postService.getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Failed to load posts');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md p-6">
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">
              Please log in to view and create posts
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="default" asChild>
                <a href="/login">Log In</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/signup">Sign Up</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Sidebar - User Profile */}
        <div className="hidden md:block">
          <Card className="sticky top-8">
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} />
                </Avatar>
                <div className="text-center">
                  <h2 className="text-xl font-semibold">{user?.username}</h2>
                  <p className="text-gray-500">{user?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Posts */}
        <div className="space-y-6">
          {/* Create Post */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={user?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} />
                </Avatar>
                <div className="flex-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-2 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center justify-center"
                  >
                    <ImageIcon className="w-5 h-5 mr-2" />
                    <span>Select Image</span>
                  </button>
                </div>
              </div>
              {imagePreview && (
                <div className="mt-4 relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    onClick={removeImage}
                  >
                    ×
                  </Button>
                </div>
              )}
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={handleCreatePost}
                  disabled={isLoading || !selectedImage}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  {isLoading ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Posts Feed */}
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>

        {/* Right Sidebar - Suggestions */}
        <div className="hidden md:block">
          <UserSuggestions />
        </div>
      </div>
    </div>
  );
}; 
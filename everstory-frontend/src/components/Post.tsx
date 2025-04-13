import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { postService } from '../services/post.service';
import { toast } from 'sonner';
import { useAuthStore } from '../store/auth.store';

interface PostProps {
  post: {
    id: string;
    content: string;
    author: string;
    likes: number;
    comments: number;
    timestamp: string;
    imageUrl?: string;
  };
}

export const Post: React.FC<PostProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const { user } = useAuthStore();

  const handleLike = async () => {
    try {
      if (isLiked) {
        await postService.unlikePost(post.id);
        setLikeCount(prev => prev - 1);
      } else {
        await postService.likePost(post.id);
        setLikeCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  };

  const handleAddComment = async () => {
    if (!commentContent.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      await postService.addComment(post.id, commentContent);
      setCommentContent('');
      setIsCommenting(false);
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  return (
    <Card>
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`} />
              <AvatarFallback>{post.author[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{post.author}</p>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
              </p>
            </div>
          </div>
          {user?.email === post.author && (
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {post.content && <p className="mb-4">{post.content}</p>}
        {post.imageUrl && (
          <div className="mb-4">
            <img
              src={post.imageUrl}
              alt="Post content"
              className="w-full rounded-lg object-cover"
            />
          </div>
        )}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center space-x-1 ${isLiked ? 'text-red-500' : ''}`}
              onClick={handleLike}
            >
              <Heart className="h-4 w-4" />
              <span>{likeCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-1"
              onClick={() => setIsCommenting(true)}
            >
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments}</span>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>

        {/* Comment Input */}
        {isCommenting && (
          <div className="mt-4 flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} />
              <AvatarFallback>{user?.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Write a comment..."
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddComment}
              disabled={!commentContent.trim()}
            >
              Post
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 
import React, { useEffect, useState } from 'react';
import { friendshipService } from '../services/friendship.service';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/auth.store';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';

interface SuggestedUser {
  email: string;
  username: string;
  status?: 'following' | 'pending' | 'none';
}

export const UserSuggestions: React.FC = () => {
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        if (!user?.email) return;

        // Fetch all users from auth service
        const allUsers = await authService.getAllUsers();
        
        // Fetch current user's friends
        const friendsResponse = await friendshipService.getFriends(user.email);
        const friends = friendsResponse.friends.map(f => 
          f.requester === user.email ? f.accepter : f.requester
        );

        // Fetch pending requests
        const pendingRequests = await friendshipService.getPendingRequests(user.email);

        // Filter out current user and friends, then map to suggested users
        const suggestions = allUsers
          .filter(u => u.email !== user.email && !friends.includes(u.email))
          .map(u => ({
            email: u.email,
            username: u.username,
            status: pendingRequests.some(r => 
              (r.requester === user.email && r.accepter === u.email) ||
              (r.requester === u.email && r.accepter === user.email)
            ) ? 'pending' : 'none'
          }));

        setSuggestedUsers(suggestions);
      } catch (error) {
        console.error('Error fetching suggested users:', error);
        toast.error('Failed to load suggestions');
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestedUsers();
  }, [user]);

  const handleFollow = async (userEmail: string) => {
    try {
      await friendshipService.sendFriendRequest(userEmail);
      setSuggestedUsers(users =>
        users.map(user =>
          user.email === userEmail ? { ...user, status: 'pending' } : user
        )
      );
      toast.success('Friend request sent');
    } catch (error) {
      console.error('Error following user:', error);
      toast.error('Failed to send friend request');
    }
  };

  const handleUnfollow = async (userEmail: string) => {
    try {
      await friendshipService.unfollow(userEmail);
      setSuggestedUsers(users =>
        users.map(user =>
          user.email === userEmail ? { ...user, status: 'none' } : user
        )
      );
      toast.success('Unfollowed successfully');
    } catch (error) {
      console.error('Error unfollowing user:', error);
      toast.error('Failed to unfollow user');
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Suggestions For You</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (suggestedUsers.length === 0) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Suggestions For You</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">No suggestions available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Suggestions For You</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suggestedUsers.map((suggestedUser) => (
            <div
              key={suggestedUser.email}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${suggestedUser.username}`} />
                  <AvatarFallback>{suggestedUser.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{suggestedUser.username}</p>
                  <p className="text-sm text-gray-500">@{suggestedUser.username}</p>
                </div>
              </div>
              {suggestedUser.status === 'following' ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUnfollow(suggestedUser.email)}
                >
                  Unfollow
                </Button>
              ) : suggestedUser.status === 'pending' ? (
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                >
                  Pending
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleFollow(suggestedUser.email)}
                >
                  Follow
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 
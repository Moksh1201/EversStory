// // import { useEffect, useState } from 'react';
// // import { userService, User } from '../../services/user.service';
// // import { FaUser } from 'react-icons/fa';
// // import { toast } from 'react-toastify';
// // import { friendshipService } from '../../services/friendship.service';
// // import { useAuth } from '../../contexts/AuthContext';

// // export const UserSuggestions = () => {
// //   const { user: currentUser, isAuthenticated } = useAuth();
// //   const [suggestions, setSuggestions] = useState<User[]>([]);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [pendingFollows, setPendingFollows] = useState<Set<string>>(new Set());

// //   useEffect(() => {
// //     const fetchSuggestions = async () => {
// //       try {
// //         setIsLoading(true);
// //         const data = await userService.getSuggestions();
// //         const updatedSuggestions = data.map((user: any) => ({
// //           ...user,
// //           isFollowing: false,
// //         }));
// //         setSuggestions(updatedSuggestions);
// //       } catch (err: any) {
// //         console.error('Error fetching suggestions:', err);
// //         setError('Failed to load suggestions');
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };

// //     fetchSuggestions();
// //   }, []);

// //   const handleFollow = async (accepterEmail: string) => {
// //     if (!isAuthenticated || !currentUser) {
// //       toast.error('Please log in to follow users');
// //       return;
// //     }

// //     const requesterEmail = currentUser.email;
// //     console.log('Attempting to follow:', accepterEmail);
// //     console.log('Current user email:', requesterEmail);

// //     setPendingFollows(prev => new Set(prev).add(accepterEmail));
// //     setSuggestions(prev =>
// //       prev.map(user =>
// //         user.email === accepterEmail ? { ...user, isFollowing: true } : user
// //       )
// //     );

// //     try {
// //       const token = localStorage.getItem('token');
// //       if (!token) {
// //         throw new Error('No authentication token found');
// //       }
      
// //       const response = await friendshipService.sendFriendRequest(accepterEmail);
// //       console.log('Follow request successful:', response);
// //       toast.success('Follow request sent');
// //     } catch (err: any) {
// //       console.error('Follow error:', err?.response?.data || err.message);
// //       toast.error(err?.response?.data?.detail || 'Failed to follow user');
// //       setSuggestions(prev =>
// //         prev.map(user =>
// //           user.email === accepterEmail ? { ...user, isFollowing: false } : user
// //         )
// //       );
// //     } finally {
// //       setPendingFollows(prev => {
// //         const newSet = new Set(prev);
// //         newSet.delete(accepterEmail);
// //         return newSet;
// //       });
// //     }
// //   };

// //   const handleUnfollow = async (accepterEmail: string) => {
// //     if (!isAuthenticated || !currentUser) {
// //       toast.error('User not authenticated');
// //       return;
// //     }

// //     const requesterEmail = currentUser.email;
// //     console.log('Attempting to unfollow:', accepterEmail);

// //     setPendingFollows(prev => new Set(prev).add(accepterEmail));
// //     setSuggestions(prev =>
// //       prev.map(user =>
// //         user.email === accepterEmail ? { ...user, isFollowing: false } : user
// //       )
// //     );

// //     try {
// //       const response = await friendshipService.unfollowUser(accepterEmail);
// //       console.log('Unfollow successful:', response);
// //       toast.success('Unfollowed successfully');
// //     } catch (err: any) {
// //       console.error('Unfollow error:', err?.response?.data || err.message);
// //       toast.error(err?.response?.data?.detail || 'Failed to unfollow user');
// //       setSuggestions(prev =>
// //         prev.map(user =>
// //           user.email === accepterEmail ? { ...user, isFollowing: true } : user
// //         )
// //       );
// //     } finally {
// //       setPendingFollows(prev => {
// //         const newSet = new Set(prev);
// //         newSet.delete(accepterEmail);
// //         return newSet;
// //       });
// //     }
// //   };

// //   if (isLoading) return <div className="text-center py-4">Loading suggestions...</div>;
// //   if (error) return <div className="text-center py-4 text-red-500">{error}</div>;
// //   if (suggestions.length === 0) return <div className="text-center py-4 text-gray-500">No suggestions</div>;

// //   return (
// //     <div className="bg-white rounded-lg shadow p-4">
// //       <h2 className="text-lg font-semibold mb-4">Suggestions For You</h2>
// //       <div className="space-y-4">
// //         {suggestions.map(user => (
// //           <div key={user.email} className="flex items-center justify-between">
// //             <div className="flex items-center space-x-3">
// //               <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
// //                 <FaUser className="text-gray-400" />
// //               </div>
// //               <p className="font-semibold">{user.username}</p>
// //             </div>
// //             <button
// //               onClick={() =>
// //                 user.isFollowing
// //                   ? handleUnfollow(user.email)
// //                   : handleFollow(user.email)
// //               }
// //               disabled={pendingFollows.has(user.email)}
// //               className={`text-sm px-3 py-1 rounded ${
// //                 user.isFollowing ? 'bg-gray-200 text-gray-700' : 'bg-blue-500 text-white'
// //               } ${pendingFollows.has(user.email) ? 'opacity-50 cursor-not-allowed' : ''}`}
// //             >
// //               {pendingFollows.has(user.email)
// //                 ? '...'
// //                 : user.isFollowing
// //                 ? 'Pending'
// //                 : 'Follow'}
// //             </button>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// import { useEffect, useState } from 'react';
// import { userService, User } from '../../services/user.service';
// import { FaUser, FaBell } from 'react-icons/fa'; // Added FaBell icon for incoming request
// import { toast } from 'react-toastify';
// import { friendshipService } from '../../services/friendship.service';
// import { useAuth } from '../../contexts/AuthContext';

// export const UserSuggestions = () => {
//   const { user: currentUser, isAuthenticated } = useAuth();
//   const [suggestions, setSuggestions] = useState<User[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [pendingFollows, setPendingFollows] = useState<Set<string>>(new Set());
//   const [receivedRequests, setReceivedRequests] = useState<Set<string>>(new Set()); // Track received requests

//   useEffect(() => {
//     const fetchSuggestions = async () => {
//       try {
//         setIsLoading(true);
//         const data = await userService.getSuggestions();
//         const updatedSuggestions = data.map((user: any) => ({
//           ...user,
//           isFollowing: false,
//         }));
//         setSuggestions(updatedSuggestions);
//       } catch (err: any) {
//         console.error('Error fetching suggestions:', err);
//         setError('Failed to load suggestions');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchSuggestions();
//   }, []);

//   const handleFollow = async (accepterEmail: string) => {
//     if (!isAuthenticated || !currentUser) {
//       toast.error('Please log in to follow users');
//       return;
//     }

//     const requesterEmail = currentUser.email;
//     console.log('Attempting to follow:', accepterEmail);
//     console.log('Current user email:', requesterEmail);

//     setPendingFollows(prev => new Set(prev).add(accepterEmail));
//     setSuggestions(prev =>
//       prev.map(user =>
//         user.email === accepterEmail ? { ...user, isFollowing: true } : user
//       )
//     );

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error('No authentication token found');
//       }

//       const response = await friendshipService.sendFriendRequest(accepterEmail);
//       console.log('Follow request successful:', response);
//       toast.success('Follow request sent');
//     } catch (err: any) {
//       console.error('Follow error:', err?.response?.data || err.message);
//       toast.error(err?.response?.data?.detail || 'Failed to follow user');
//       setSuggestions(prev =>
//         prev.map(user =>
//           user.email === accepterEmail ? { ...user, isFollowing: false } : user
//         )
//       );
//     } finally {
//       setPendingFollows(prev => {
//         const newSet = new Set(prev);
//         newSet.delete(accepterEmail);
//         return newSet;
//       });
//     }
//   };

//   const handleUnfollow = async (accepterEmail: string) => {
//     if (!isAuthenticated || !currentUser) {
//       toast.error('User not authenticated');
//       return;
//     }

//     const requesterEmail = currentUser.email;
//     console.log('Attempting to unfollow:', accepterEmail);

//     setPendingFollows(prev => new Set(prev).add(accepterEmail));
//     setSuggestions(prev =>
//       prev.map(user =>
//         user.email === accepterEmail ? { ...user, isFollowing: false } : user
//       )
//     );

//     try {
//       const response = await friendshipService.unfollowUser(accepterEmail);
//       console.log('Unfollow successful:', response);
//       toast.success('Unfollowed successfully');
//     } catch (err: any) {
//       console.error('Unfollow error:', err?.response?.data || err.message);
//       toast.error(err?.response?.data?.detail || 'Failed to unfollow user');
//       setSuggestions(prev =>
//         prev.map(user =>
//           user.email === accepterEmail ? { ...user, isFollowing: true } : user
//         )
//       );
//     } finally {
//       setPendingFollows(prev => {
//         const newSet = new Set(prev);
//         newSet.delete(accepterEmail);
//         return newSet;
//       });
//     }
//   };

//   const handleReceivedRequest = (userEmail: string) => {
//     // Add email to the received requests set
//     setReceivedRequests(prev => new Set(prev).add(userEmail));
//   };

//   if (isLoading) return <div className="text-center py-4">Loading suggestions...</div>;
//   if (error) return <div className="text-center py-4 text-red-500">{error}</div>;
//   if (suggestions.length === 0) return <div className="text-center py-4 text-gray-500">No suggestions</div>;

//   return (
//     <div className="bg-white rounded-lg shadow p-4">
//       <h2 className="text-lg font-semibold mb-4">Suggestions For You</h2>
//       <div className="space-y-4">
//         {suggestions.map(user => (
//           <div key={user.email} className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
//                 <FaUser className="text-gray-400" />
//               </div>
//               <p className="font-semibold">{user.username}</p>
//             </div>
//             <div className="flex items-center space-x-3">
//               {/* Show the bell icon if the user has a received request */}
//               {receivedRequests.has(user.email) && <FaBell className="text-yellow-500" />}
//               <button
//                 onClick={() =>
//                   user.isFollowing
//                     ? handleUnfollow(user.email)
//                     : handleFollow(user.email)
//                 }
//                 disabled={pendingFollows.has(user.email)}
//                 className={`text-sm px-3 py-1 rounded ${
//                   user.isFollowing ? 'bg-gray-200 text-gray-700' : 'bg-blue-500 text-white'
//                 } ${pendingFollows.has(user.email) ? 'opacity-50 cursor-not-allowed' : ''}`}
//               >
//                 {pendingFollows.has(user.email)
//                   ? '...'
//                   : user.isFollowing
//                   ? 'Pending'
//                   : 'Follow'}
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };
import { useEffect, useState } from 'react';
import { userService, User } from '../../services/user.service';
import { FaUser, FaBell } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { friendshipService } from '../../services/friendship.service';
import { useAuth } from '../../contexts/AuthContext';

export const UserSuggestions = () => {
  const { user: currentUser, isAuthenticated } = useAuth();
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingFollows, setPendingFollows] = useState<Set<string>>(new Set());
  const [receivedRequests, setReceivedRequests] = useState<Set<string>>(new Set());
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [friendRequests, setFriendRequests] = useState<User[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setIsLoading(true);
        const data = await userService.getSuggestions();
        const updatedSuggestions = data.map((user: any) => ({
          ...user,
          isFollowing: false,
        }));
        setSuggestions(updatedSuggestions);
      } catch (err: any) {
        console.error('Error fetching suggestions:', err);
        setError('Failed to load suggestions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  const fetchFriendRequests = async () => {
    try {
      const requests = await friendshipService.getFriendRequests();
      setFriendRequests(requests);
    } catch (err: any) {
      console.error('Error fetching friend requests:', err);
      toast.error('Failed to load friend requests');
    }
  };

  const handleBellClick = async () => {
    await fetchFriendRequests();
    setShowRequestsModal(true);
  };

  const handleAcceptRequest = async (requesterEmail: string) => {
    try {
      await friendshipService.acceptFriendRequest(requesterEmail);
      toast.success('Friend request accepted');
      setFriendRequests(prev => prev.filter(user => user.email !== requesterEmail));
      // Update the suggestions list to reflect the new friendship
      setSuggestions(prev => 
        prev.map(user => 
          user.email === requesterEmail ? { ...user, isFollowing: true } : user
        )
      );
    } catch (err: any) {
      console.error('Error accepting friend request:', err);
      toast.error('Failed to accept friend request');
    }
  };

  const handleRejectRequest = async (requesterEmail: string) => {
    try {
      await friendshipService.rejectFriendRequest(requesterEmail);
      toast.success('Friend request rejected');
      setFriendRequests(prev => prev.filter(user => user.email !== requesterEmail));
    } catch (err: any) {
      console.error('Error rejecting friend request:', err);
      toast.error('Failed to reject friend request');
    }
  };

  const handleFollow = async (accepterEmail: string) => {
    if (!isAuthenticated || !currentUser) {
      toast.error('Please log in to follow users');
      return;
    }

    const requesterEmail = currentUser.email;
    console.log('Attempting to follow:', accepterEmail);
    console.log('Current user email:', requesterEmail);

    setPendingFollows(prev => new Set(prev).add(accepterEmail));
    setSuggestions(prev =>
      prev.map(user =>
        user.email === accepterEmail ? { ...user, isFollowing: true } : user
      )
    );

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await friendshipService.sendFriendRequest(accepterEmail);
      console.log('Follow request successful:', response);
      toast.success('Follow request sent');
    } catch (err: any) {
      console.error('Follow error:', err?.response?.data || err.message);
      toast.error(err?.response?.data?.detail || 'Failed to follow user');
      setSuggestions(prev =>
        prev.map(user =>
          user.email === accepterEmail ? { ...user, isFollowing: false } : user
        )
      );
    } finally {
      setPendingFollows(prev => {
        const newSet = new Set(prev);
        newSet.delete(accepterEmail);
        return newSet;
      });
    }
  };

  const handleUnfollow = async (accepterEmail: string) => {
    if (!isAuthenticated || !currentUser) {
      toast.error('User not authenticated');
      return;
    }

    const requesterEmail = currentUser.email;
    console.log('Attempting to unfollow:', accepterEmail);

    setPendingFollows(prev => new Set(prev).add(accepterEmail));
    setSuggestions(prev =>
      prev.map(user =>
        user.email === accepterEmail ? { ...user, isFollowing: false } : user
      )
    );

    try {
      const response = await friendshipService.unfollowUser(accepterEmail);
      console.log('Unfollow successful:', response);
      toast.success('Unfollowed successfully');
    } catch (err: any) {
      console.error('Unfollow error:', err?.response?.data || err.message);
      toast.error(err?.response?.data?.detail || 'Failed to unfollow user');
      setSuggestions(prev =>
        prev.map(user =>
          user.email === accepterEmail ? { ...user, isFollowing: true } : user
        )
      );
    } finally {
      setPendingFollows(prev => {
        const newSet = new Set(prev);
        newSet.delete(accepterEmail);
        return newSet;
      });
    }
  };

  if (isLoading) return <div className="text-center py-4">Loading suggestions...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;
  if (suggestions.length === 0) return <div className="text-center py-4 text-gray-500">No suggestions</div>;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Suggestions For You</h2>
        <button
          onClick={handleBellClick}
          className="text-yellow-500 hover:text-yellow-600 p-2 rounded-full hover:bg-yellow-50"
        >
          <FaBell className="text-xl" />
        </button>
      </div>
      <div className="space-y-4">
        {suggestions.map(user => (
          <div key={user.email} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <FaUser className="text-gray-400" />
              </div>
              <p className="font-semibold">{user.username}</p>
            </div>
            <button
              onClick={() =>
                user.isFollowing
                  ? handleUnfollow(user.email)
                  : handleFollow(user.email)
              }
              disabled={pendingFollows.has(user.email)}
              className={`text-sm px-3 py-1 rounded ${
                user.isFollowing ? 'bg-gray-200 text-gray-700' : 'bg-blue-500 text-white'
              } ${pendingFollows.has(user.email) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {pendingFollows.has(user.email)
                ? '...'
                : user.isFollowing
                ? 'Pending'
                : 'Follow'}
            </button>
          </div>
        ))}
      </div>

      {/* Friend Requests Modal */}
      {showRequestsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Friend Requests</h3>
              <button
                onClick={() => setShowRequestsModal(false)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              {friendRequests.length === 0 ? (
                <p className="text-gray-500 text-center">No pending friend requests</p>
              ) : (
                friendRequests.map(request => (
                  <div key={request.email} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <FaUser className="text-gray-400" />
                      </div>
                      <p className="font-semibold">{request.username}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAcceptRequest(request.email)}
                        className="text-sm px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request.email)}
                        className="text-sm px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
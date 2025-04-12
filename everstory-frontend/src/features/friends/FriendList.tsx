import { useQuery } from "@tanstack/react-query";
import { getFriendList } from "./api";

export const FriendList = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getFriendList,
  });

  if (isLoading) return <p>Loading friends...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">Your Friends</h2>
      {data?.length ? (
        data.map((friend) => (
          <div key={friend._id} className="border p-3 rounded-md">
            <p className="font-medium">{friend.name}</p>
            <p className="text-sm text-gray-500">{friend.email}</p>
          </div>
        ))
      ) : (
        <p>You haven't added any friends yet.</p>
      )}
    </div>
  );
};

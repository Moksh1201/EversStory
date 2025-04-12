import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { followUser, unfollowUser, getFollowStatus } from "./api";
import { Button } from "@/components/Button";

export const FollowButton = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient();

  const { data: status, isLoading } = useQuery({
    queryKey: ["followStatus", userId],
    queryFn: () => getFollowStatus(userId),
  });

  const followMutation = useMutation({
    mutationFn: () => followUser(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["followStatus", userId] }),
  });

  const unfollowMutation = useMutation({
    mutationFn: () => unfollowUser(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["followStatus", userId] }),
  });

  if (isLoading) return <Button disabled>Checking...</Button>;

  return status?.isFollowing ? (
    <Button onClick={() => unfollowMutation.mutate()} variant="secondary">
      Unfollow
    </Button>
  ) : (
    <Button onClick={() => followMutation.mutate()}>Follow</Button>
  );
};

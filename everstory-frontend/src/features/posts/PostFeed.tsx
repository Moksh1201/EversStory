import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPosts } from "./api";
import { PostCard } from "./PostCard";
import { useEffect, useRef } from "react";

export const PostFeed = () => {
  const observerRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam),
    getNextPageParam: (_, pages) => pages.length + 1,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasNextPage, fetchNextPage]);

  return (
    <div className="space-y-6">
      {data?.pages.map((page) =>
        page.map((post) => <PostCard key={post._id} post={post} />)
      )}
      <div ref={observerRef} className="h-10" />
      {isFetchingNextPage && <p>Loading more...</p>}
    </div>
  );
};

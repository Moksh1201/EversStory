import { Post } from "./types";

export const PostCard = ({ post }: { post: Post }) => {
  return (
    <div className="border rounded-xl p-4 shadow-md bg-white">
      <img src={post.imageUrl} alt="Post" className="w-full rounded-md mb-2" />
      <p className="font-semibold">{post.caption}</p>
      <div className="text-sm text-gray-500 mt-1">
        by {post.author.name} • {new Date(post.createdAt).toLocaleString()}
      </div>
    </div>
  );
};

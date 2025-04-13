import { useState } from "react";
import { postService } from "../../services/post.services";
import { Button } from "@/components/Button";

export const CreatePost = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please select an image");

    try {
      await postService.createPost(file);
      alert("Post created!");
      setFile(null);
    } catch (err) {
      alert("Failed to create post");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-6">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        accept="image/*"
      />
      <Button type="submit">Upload Image</Button>
    </form>
  );
};

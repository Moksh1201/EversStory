import { useState } from "react";
import { createPost } from "./api";
import { Button } from "@/components/Button";

export const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [visibility, setVisibility] = useState<"public" | "private">("public");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please select an image");

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("visibility", visibility);
    formData.append("image", file);

    try {
      await createPost(formData);
      alert("Post created!");
      setCaption("");
      setFile(null);
    } catch (err) {
      alert("Failed to create post");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-6">
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <textarea
        placeholder="Write a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full border p-2 rounded-md"
      />
      <select value={visibility} onChange={(e) => setVisibility(e.target.value as any)} className="p-2 rounded-md border">
        <option value="public">Public</option>
        <option value="private">Private</option>
      </select>
      <Button type="submit">Post</Button>
    </form>
  );
};

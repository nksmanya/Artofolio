"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CyberpunkButton } from "@/app/components/CyberpunkButton";
import { useSession } from "next-auth/react";

export default function NewArtworkPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !title) {
      setError("Title and an image are required.");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    // 1. Upload image to Cloudinary
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "artopolio_preset"); // The unsigned preset you created

    try {
      const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!cloudinaryResponse.ok) {
        throw new Error("Image upload failed");
      }

      const cloudinaryData = await cloudinaryResponse.json();
      const imageUrl = cloudinaryData.secure_url;

      // 2. Save artwork details to your database
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);

      const dbResponse = await fetch('/api/artwork', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          tags: tagArray,
        }),
      });

      if (!dbResponse.ok) {
        const errText = await dbResponse.text();
        throw new Error(`Failed to save artwork data: ${dbResponse.status} ${errText}`);
      }

      router.push('/'); // Redirect to homepage on success
      router.refresh(); // Refresh server components
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    router.push('/');
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto p-8 border-2 border-cyan-500/50 rounded-lg shadow-[0_0_20px_#0891b2]">
      <h1 className="text-3xl font-bold mb-6 text-cyan-400">Add New Artwork</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-cyan-300 mb-2">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-800 border-2 border-gray-600 rounded-md p-2 focus:border-cyan-500 focus:ring-cyan-500 transition"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-cyan-300 mb-2">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full bg-gray-800 border-2 border-gray-600 rounded-md p-2 focus:border-cyan-500 focus:ring-cyan-500 transition"
          />
        </div>
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-cyan-300 mb-2">Tags (comma-separated)</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full bg-gray-800 border-2 border-gray-600 rounded-md p-2 focus:border-cyan-500 focus:ring-cyan-500 transition"
            placeholder="e.g., cyberpunk, neon, character"
          />
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-cyan-300 mb-2">Image</label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            accept="image/*"
            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-500"
            required
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div>
          <CyberpunkButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Artwork"}
          </CyberpunkButton>
        </div>
      </form>
    </div>
  );
}

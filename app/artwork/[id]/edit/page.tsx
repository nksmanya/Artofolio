"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CyberpunkButton } from "@/app/components/CyberpunkButton";

export default function EditArtworkPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/artwork/${params.id}`);
      if (!res.ok) return;
      const data = await res.json();
      setTitle(data.title || "");
      setDescription(data.description || "");
      setTags((data.tags || []).map((t: any) => t.name).join(", "));
      setImageUrl(data.imageUrl || "");
      setIsFeatured(!!data.isFeatured);
      setLoading(false);
    })();
  }, [params.id]);

  if (status === 'loading' || loading) return <p className="p-6">Loading...</p>;
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    router.push('/');
    return null;
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/artwork/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, imageUrl, isFeatured, tags: tags.split(',').map(t => t.trim()).filter(Boolean) }),
      });
      if (!res.ok) throw new Error('Failed to save');
      router.push(`/artwork/${params.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 border-2 border-cyan-500/50 rounded-lg shadow-[0_0_20px_#0891b2]">
      <h1 className="text-3xl font-bold mb-6 text-cyan-400">Edit Artwork</h1>
      <form onSubmit={save} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-2">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-gray-800 border-2 border-gray-600 rounded-md p-2 focus:border-cyan-500 focus:ring-cyan-500 transition" />
        </div>
        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-2">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full bg-gray-800 border-2 border-gray-600 rounded-md p-2 focus:border-cyan-500 focus:ring-cyan-500 transition" />
        </div>
        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-2">Tags (comma-separated)</label>
          <input value={tags} onChange={(e) => setTags(e.target.value)} className="w-full bg-gray-800 border-2 border-gray-600 rounded-md p-2 focus:border-cyan-500 focus:ring-cyan-500 transition" />
        </div>
        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-2">Image URL</label>
          <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full bg-gray-800 border-2 border-gray-600 rounded-md p-2 focus:border-cyan-500 focus:ring-cyan-500 transition" />
        </div>
        <div className="flex items-center gap-2">
          <input id="featured" type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
          <label htmlFor="featured" className="text-cyan-300">Featured</label>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <CyberpunkButton type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</CyberpunkButton>
      </form>
    </div>
  );
}



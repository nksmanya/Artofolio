"use client";

import React, { useState } from "react";

export default function CommentForm({ artworkId }: { artworkId: string }) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/artwork/${artworkId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error('Failed to post comment');
      setContent("");
      if (typeof window !== 'undefined') window.location.reload();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col gap-2" onSubmit={submit}>
      <textarea
        name="content"
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Say something nice..."
        className="w-full bg-gray-800 border-2 border-gray-600 rounded-md p-2 focus:border-cyan-500 focus:ring-cyan-500 transition"
      />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button type="submit" disabled={submitting} className="self-end px-4 py-2 bg-cyan-600 rounded border border-cyan-400 text-sm font-bold disabled:opacity-50">
        {submitting ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  );
}



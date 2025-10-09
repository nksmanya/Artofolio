"use client";

import React, { useState } from "react";

export default function CommentForm({ artworkId }: { artworkId: string }) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await fetch(`/api/artwork/${artworkId}/comments`);
      if (!res.ok) return;
      const data = await res.json();
      setComments(data);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { load(); }, [artworkId]);

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
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
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
      <div className="mt-4 space-y-4">
        {loading ? <p className="text-gray-500">Loading comments...</p> : (
          comments.length ? comments.map((c) => (
            <CommentItem key={c.id} comment={c} onChanged={load} />
          )) : <p className="text-gray-500">No comments yet.</p>
        )}
      </div>
    </div>
  );
}

function CommentItem({ comment, onChanged }: { comment: any; onChanged: () => Promise<void> }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);

  const canModerate = Boolean(comment.canModerate); // server not sending; kept for future

  const doDelete = async () => {
    if (!confirm('Delete this comment?')) return;
    await fetch(`/api/artwork/${comment.artworkId}/comments`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: comment.id }),
    });
    await onChanged();
  };

  const doSave = async () => {
    await fetch(`/api/artwork/${comment.artworkId}/comments`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: comment.id, content: draft }),
    });
    setIsEditing(false);
    await onChanged();
  };

  return (
    <div className="border border-cyan-500/30 rounded p-3 bg-gray-800/40">
      <div className="text-sm text-gray-400 mb-1">{comment.author?.name || 'User'} · {new Date(comment.createdAt).toLocaleString()}</div>
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <textarea value={draft} onChange={(e) => setDraft(e.target.value)} className="w-full bg-gray-800 border-2 border-gray-600 rounded-md p-2 focus:border-cyan-500 focus:ring-cyan-500 transition" />
          <div className="flex gap-2">
            <button onClick={doSave} className="px-3 py-1 bg-cyan-600 rounded border border-cyan-400 text-xs font-bold">Save</button>
            <button onClick={() => setIsEditing(false)} className="px-3 py-1 bg-gray-700 rounded border border-gray-500 text-xs font-bold">Cancel</button>
          </div>
        </div>
      ) : (
        <p className="text-gray-200 whitespace-pre-wrap">{comment.content}</p>
      )}
      <div className="mt-2 flex gap-2">
        <button onClick={() => setIsEditing((v) => !v)} className="px-3 py-1 bg-amber-600 rounded border border-amber-400 text-xs font-bold">Edit</button>
        <button onClick={doDelete} className="px-3 py-1 bg-red-600 rounded border border-red-400 text-xs font-bold">Delete</button>
      </div>
    </div>
  );
}



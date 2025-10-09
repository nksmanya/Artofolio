"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function SearchBar() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState("");
  const [tags, setTags] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setQ(params.get("q") || "");
    setTags(params.get("tags") || "");
  }, [params]);

  useEffect(() => setMounted(true), []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const usp = new URLSearchParams();
    if (q.trim()) usp.set("q", q.trim());
    if (tags.trim()) usp.set("tags", tags.trim());
    const query = usp.toString();
    router.push(query ? `/?${query}#latest` : "/#latest");
  };

  if (!mounted) return null;

  return (
    <form onSubmit={submit} className="hidden md:flex items-center gap-2">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search title/desc"
        className="bg-gray-800/80 border border-cyan-600/50 rounded px-3 py-1 text-sm focus:outline-none focus:border-cyan-400"
      />
      <input
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="tags (comma)"
        className="bg-gray-800/80 border border-cyan-600/50 rounded px-3 py-1 text-sm focus:outline-none focus:border-cyan-400"
      />
      <button className="px-3 py-1 bg-cyan-600 border border-cyan-400 rounded text-sm font-bold">Search</button>
    </form>
  );
}



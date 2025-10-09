"use client";

import Link from "next/link";

export default function ArtworkActions({
  artworkId,
  imageUrl,
  title,
  isAdmin,
  baseUrl,
}: {
  artworkId: string;
  imageUrl: string;
  title: string;
  isAdmin: boolean;
  baseUrl?: string;
}) {
  const shareHref = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    baseUrl ? `${baseUrl}/artwork/${artworkId}` : ""
  )}&text=${encodeURIComponent(`Check out ${title} on Artopolio!`)}`;

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  const handleDelete = async () => {
    if (!confirm("Delete this artwork?")) return;
    await fetch(`/api/artwork/${artworkId}`, { method: "DELETE" });
    if (typeof window !== "undefined") window.location.href = "/";
  };

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <Link
        href={shareHref}
        className="px-4 py-2 bg-cyan-600 rounded border border-cyan-400 text-sm font-bold"
      >
        Share
      </Link>
      <a
        href={imageUrl}
        download
        className="px-4 py-2 bg-gray-800 rounded border border-cyan-400 text-sm font-bold"
      >
        Download
      </a>
      <button
        onClick={handlePrint}
        className="px-4 py-2 bg-gray-800 rounded border border-cyan-400 text-sm font-bold"
      >
        Print
      </button>
      {isAdmin && (
        <>
          <Link
            href={`/artwork/${artworkId}/edit`}
            className="px-4 py-2 bg-amber-600 rounded border border-amber-400 text-sm font-bold"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 rounded border border-red-400 text-sm font-bold"
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
}



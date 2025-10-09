import { prisma } from "@/app/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import CommentForm from "@/app/components/CommentForm";
import ArtworkActions from "@/app/components/ArtworkActions";

interface ArtworkDetailPageProps {
  params: {
    id: string;
  };
}

/**
 * A dynamic page component to display the details of a single artwork.
 * It fetches the artwork data from the database based on the ID in the URL.
 */
export default async function ArtworkDetailPage({ params }: ArtworkDetailPageProps) {
  const session = await getServerSession(authOptions);
  const artwork = await prisma.artwork.findUnique({
    where: { id: params.id },
    include: {
      author: true,
      tags: true,
      comments: { include: { author: true }, orderBy: { createdAt: 'desc' } },
    },
  });

  // If no artwork is found for the given ID, display a 404 page.
  if (!artwork) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/" className="text-cyan-400 hover:text-cyan-300 transition-colors">
          &larr; Back to Gallery
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Image Column */}
        <div className="relative aspect-square border-2 border-cyan-500/50 rounded-lg overflow-hidden">
          <Image
            src={artwork.imageUrl}
            alt={artwork.title}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Details Column */}
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold text-cyan-400">{artwork.title}</h1>
          {artwork.isFeatured && (
            <span className="self-start rounded bg-fuchsia-600 text-white text-xs font-bold px-2 py-1">FEATURED</span>
          )}

          {artwork.author && (
            <div className="flex items-center gap-3">
              <Image
                src={artwork.author.image || ""}
                alt={artwork.author.name || "Author"}
                width={40}
                height={40}
                className="rounded-full border-2 border-cyan-400"
              />
              <span className="font-semibold text-lg text-gray-300">
                by {artwork.author.name}
              </span>
            </div>
          )}

          {artwork.description && (
            <p className="text-gray-400 whitespace-pre-wrap">
              {artwork.description}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mt-4">
            {artwork.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-3 py-1 bg-gray-700 text-cyan-300 text-sm font-semibold rounded-full"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <ArtworkActions
        artworkId={artwork.id}
        imageUrl={artwork.imageUrl}
        title={artwork.title}
        isAdmin={!!(session && (session.user as any)?.role === 'ADMIN')}
        baseUrl={process.env.NEXT_PUBLIC_BASE_URL}
      />

      {/* Comments */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-cyan-400 mb-3">Comments</h2>
        {session ? (
          <CommentForm artworkId={artwork.id} />
        ) : (
          <p className="text-gray-500">Sign in to leave a comment.</p>
        )}
        <div className="mt-4 space-y-4">
          {artwork.comments?.map((c) => (
            <div key={c.id} className="border border-cyan-500/30 rounded p-3 bg-gray-800/40">
              <div className="text-sm text-gray-400 mb-1">{(c as any).author?.name || 'User'} · {new Date(c.createdAt).toLocaleString()}</div>
              <p className="text-gray-200 whitespace-pre-wrap">{c.content}</p>
            </div>
          ))}
          {(!artwork.comments || artwork.comments.length === 0) && <p className="text-gray-500">No comments yet.</p>}
        </div>
      </section>
    </div>
  );
}

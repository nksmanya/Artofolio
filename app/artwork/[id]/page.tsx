import { prisma } from "@/app/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

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
  const artwork = await prisma.artwork.findUnique({
    where: { id: params.id },
    include: {
      author: true,
      tags: true,
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
    </div>
  );
}

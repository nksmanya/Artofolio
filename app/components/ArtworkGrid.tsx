"use client";

import { Artwork, Tag } from "@prisma/client";
import ArtworkItem from "./ArtworkItem";

// Extends the default Artwork type to include the `tags` relation,
// ensuring the full artwork data is available for each ArtworkItem.
interface ArtworkWithTags extends Artwork {
  tags: Tag[];
}

/**
 * A component that displays a collection of artworks in a responsive grid.
 * If the artworks array is empty, it renders a message prompting the user to add art.
 */
export default function ArtworkGrid({ artworks }: { artworks: ArtworkWithTags[] }) {
    // If there are no artworks, display a helpful message.
    if (artworks.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-400">No artwork to display.</h2>
        <p className="text-gray-500 mt-2">Sign in to add your first piece!</p>
      </div>
    );
  }

  // Otherwise, map over the artworks and render an ArtworkItem for each one
  // in a responsive grid layout.
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {artworks.map((artwork) => (
        <ArtworkItem key={artwork.id} artwork={artwork} />
      ))}
    </div>
  );
}


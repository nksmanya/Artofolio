import ArtworkGrid from "./components/ArtworkGrid";
import { prisma } from "./lib/prisma";

export default async function Home() {
  const artworks = await prisma.artwork.findMany({
    include: { tags: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center mb-8 text-cyan-400">Artopolio</h1>
      <ArtworkGrid artworks={artworks} />
    </div>
  );
}
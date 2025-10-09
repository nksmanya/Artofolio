import ArtworkGrid from "./components/ArtworkGrid";
import { prisma } from "./lib/prisma";

export default async function Home() {
  const [featured, recent] = await Promise.all([
    prisma.artwork.findMany({
      where: { isFeatured: true },
      include: { tags: true },
      orderBy: { createdAt: "desc" },
      take: 9,
    }),
    prisma.artwork.findMany({
      include: { tags: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center mb-8 text-cyan-400">Artopolio</h1>
      {featured.length > 0 && (
        <section id="featured" className="w-full mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-fuchsia-400">Featured Art</h2>
            <span className="text-sm text-cyan-300">Top {featured.length} picks</span>
          </div>
          <ArtworkGrid artworks={featured} />
        </section>
      )}
      <section id="latest" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-cyan-400">Latest</h2>
        </div>
        <ArtworkGrid artworks={recent} />
      </section>
    </div>
  );
}
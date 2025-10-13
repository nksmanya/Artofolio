import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { isMainAdmin, getConfiguredAdminEmail } from "@/app/lib/authz";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Only main admin can create artworks
  if (!isMainAdmin(session)) {
    return NextResponse.json(
      {
        error: "Forbidden: only main admin can create",
        hint: `Set ADMIN_EMAIL or NEXT_PUBLIC_ADMIN_EMAIL to your admin email. Current session: ${
          session.user?.email || "unknown"
        }, configured: ${getConfiguredAdminEmail() || "not set"}`,
      },
      { status: 403 }
    );
  }

  try {
    const { title, description, imageUrl, tags } = await req.json();

    if (!title || !imageUrl) {
      return NextResponse.json(
        { error: "Title and Image URL are required" },
        { status: 400 }
      );
    }

    // Find or create tags
    const tagObjects = await Promise.all(
      tags.map(async (tagName: string) => {
        return await prisma.tag.upsert({
          where: { name: tagName.trim().toLowerCase() },
          update: {},
          create: { name: tagName.trim().toLowerCase() },
        });
      })
    );

    // ✅ FIX: Use user's email to find their ID in the database
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user?.email || "" },
      select: { id: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found in database" }, { status: 404 });
    }

    const newArtwork = await prisma.artwork.create({
      data: {
        title,
        description,
        imageUrl,
        authorId: dbUser.id,
        tags: {
          connect: tagObjects.map((tag) => ({ id: tag.id })),
        },
      },
    });

    return NextResponse.json(newArtwork, { status: 201 });
  } catch (error) {
    console.error("Error creating artwork:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const artworks = await prisma.artwork.findMany({
      include: {
        tags: true,
        author: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(artworks);
  } catch (error) {
    console.error("Error fetching artworks:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

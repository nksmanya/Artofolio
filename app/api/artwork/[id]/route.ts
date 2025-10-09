import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import cloudinary from "@/app/lib/cloudinary";
import { isMainAdmin } from "@/app/lib/authz";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const artwork = await prisma.artwork.findUnique({
      where: { id: params.id },
      include: { tags: true, author: true, comments: { include: { author: true } } },
    });
    if (!artwork) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(artwork);
  } catch (error) {
    console.error("Error fetching artwork:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  if (!isMainAdmin(session)) return NextResponse.json({ error: "Forbidden: only main admin can update", hint: `Set ADMIN_EMAIL in .env.local. Session: ${session.user?.email || 'unknown'}` }, { status: 403 });

  try {
    const { title, description, imageUrl, tags, isFeatured } = await req.json();

    const updateData: any = { title, description, imageUrl, isFeatured };

    // Handle tags if provided
    if (Array.isArray(tags)) {
      const tagObjects = await Promise.all(
        tags.map(async (tagName: string) =>
          prisma.tag.upsert({
            where: { name: tagName.trim().toLowerCase() },
            update: {},
            create: { name: tagName.trim().toLowerCase() },
          })
        )
      );
      updateData.tags = { set: [], connect: tagObjects.map((t) => ({ id: t.id })) };
    }

    const updated = await prisma.artwork.update({
      where: { id: params.id },
      data: updateData,
      include: { tags: true },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating artwork:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  if (!isMainAdmin(session)) return NextResponse.json({ error: "Forbidden: only main admin can delete", hint: `Set ADMIN_EMAIL in .env.local. Session: ${session.user?.email || 'unknown'}` }, { status: 403 });

  try {
    const existing = await prisma.artwork.findUnique({ where: { id: params.id } });
    if (existing?.imageUrl) {
      const publicId = extractCloudinaryPublicId(existing.imageUrl);
      if (publicId) {
        try { await cloudinary.uploader.destroy(publicId); } catch {}
      }
    }
    await prisma.comment.deleteMany({ where: { artworkId: params.id } });
    await prisma.artwork.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error deleting artwork:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

function extractCloudinaryPublicId(url: string): string | null {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/");
    const filename = parts[parts.length - 1];
    const withoutExt = filename.replace(/\.[^.]+$/, "");
    // Preceding folder path after '/upload/' becomes part of public id
    const uploadIndex = parts.findIndex((p) => p === "upload");
    if (uploadIndex >= 0) {
      const pathParts = parts.slice(uploadIndex + 1, parts.length - 1);
      const folderPath = pathParts.length ? pathParts.join("/") + "/" : "";
      return folderPath + withoutExt;
    }
    return withoutExt;
  } catch {
    return null;
  }
}



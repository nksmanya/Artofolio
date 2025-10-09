import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { isMainAdmin } from "@/app/lib/authz";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const comments = await prisma.comment.findMany({
      where: { artworkId: params.id },
      include: { author: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    const { content } = await req.json();
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content required' }, { status: 400 });
    }

    const created = await prisma.comment.create({
      data: {
        content: content.trim().slice(0, 500),
        authorId: (session.user as any).id,
        artworkId: params.id,
      },
      include: { author: true },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  try {
    const { id, content } = await req.json();
    const existing = await prisma.comment.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const isOwner = existing.authorId === (session.user as any).id;
    if (!isOwner && !isMainAdmin(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const updated = await prisma.comment.update({ where: { id }, data: { content: String(content).slice(0,500) } });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  try {
    const { id } = await req.json();
    const existing = await prisma.comment.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const isOwner = existing.authorId === (session.user as any).id;
    if (!isOwner && !isMainAdmin(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    await prisma.comment.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}



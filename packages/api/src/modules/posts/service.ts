import { prisma } from "../../lib/prisma";

export const createPost = (authorId: string, title: string, content?: string) =>
  prisma.post.create({
    data: { authorId, title, content },
    select: {
      id: true,
      title: true,
      content: true,
      authorId: true,
      createdAt: true,
    },
  });

export const listPosts = (authorId?: string) =>
  prisma.post.findMany({
    where: authorId ? { authorId } : undefined,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      content: true,
      authorId: true,
      createdAt: true,
    },
  });

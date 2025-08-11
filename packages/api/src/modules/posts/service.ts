import { prisma } from "../../lib/prisma";

export async function createPost(
  authorId: string,
  title: string,
  content?: string
) {
  return prisma.post.create({
    data: { title, content, authorId },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function listPosts(authorId?: string) {
  return prisma.post.findMany({
    where: authorId ? { authorId } : undefined,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

import { createTestApp as createTestAppWithIO } from "./test-server";
import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/hash";

export async function createTestApp() {
  return createTestAppWithIO();
}

export async function resetDb() {
  try {
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();

    const userCount = await prisma.user.count();
    const postCount = await prisma.post.count();

    if (userCount > 0 || postCount > 0) {
      console.warn(
        `Database not fully cleaned: ${userCount} users, ${postCount} posts`
      );
      await prisma.$executeRaw`TRUNCATE TABLE "Post" CASCADE`;
      await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE`;
    }
  } catch (error) {
    console.warn("Error resetting database:", error);
  }
}

let userCounter = 0;

export async function createTestUser(
  email?: string,
  password = "password123",
  name = "Test User"
) {
  const uniqueEmail = email || `test${userCounter++}@example.com`;
  const hashedPassword = hashPassword(password);

  return prisma.user.create({
    data: {
      email: uniqueEmail,
      password: hashedPassword,
      name,
      role: "USER",
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });
}

export async function createTestPost(
  authorId: string,
  title = "Test Post",
  content = "Test content"
) {
  return prisma.post.create({
    data: {
      title,
      content,
      authorId,
    },
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

export function resetUserCounter() {
  userCounter = 0;
}

import { buildServer } from "../server";
import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/hash";

export async function createTestApp() {
  const app = await buildServer();
  await app.ready();
  return app;
}

export async function resetDb() {
  try {
    // Limpiar en orden correcto (posts antes que users por foreign key)
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();

    // Verificar que se limpió correctamente
    const userCount = await prisma.user.count();
    const postCount = await prisma.post.count();

    if (userCount > 0 || postCount > 0) {
      console.warn(
        `Database not fully cleaned: ${userCount} users, ${postCount} posts`
      );
    }
  } catch (error) {
    // Si la base de datos no existe o hay otros errores, los ignoramos
    console.warn("Error resetting database:", error);
  }
}

export async function createTestUser(
  email = "test@example.com",
  password = "password123",
  name = "Test User"
) {
  const hashedPassword = hashPassword(password);

  return prisma.user.create({
    data: {
      email,
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

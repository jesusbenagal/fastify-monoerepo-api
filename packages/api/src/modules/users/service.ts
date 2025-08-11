import { prisma } from "../../lib/prisma";
import { NotFoundError } from "../../lib/errors";
import type { UpdateUserInput } from "../../lib/validation";

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatarUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new NotFoundError("User");
  }

  return user;
}

export async function listUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatarUrl: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateUser(id: string, data: UpdateUserInput) {
  const user = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatarUrl: true,
      updatedAt: true,
    },
  });

  return user;
}

export async function deleteUser(id: string) {
  const user = await prisma.user.delete({
    where: { id },
    select: { id: true, email: true },
  });

  return { message: `User ${user.email} deleted successfully` };
}

import { prisma } from "../../lib/prisma";

export const getUserById = (id: string) =>
  prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatarUrl: true,
      createdAt: true,
    },
  });

export const listUsers = () =>
  prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

export const updateUser = (id: string, data: { name?: string }) =>
  prisma.user.update({
    where: { id },
    data,
    select: { id: true, email: true, name: true, role: true },
  });

export const deleteUser = (id: string) =>
  prisma.user.delete({ where: { id }, select: { id: true } });

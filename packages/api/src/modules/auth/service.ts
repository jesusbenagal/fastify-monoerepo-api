import type { Role } from "@app/db";

import { hashPassword, verifyPassword } from "../../lib/hash";
import { prisma } from "../../lib/prisma";
import { ConflictError, NotFoundError } from "../../lib/errors";

export async function registerUser(
  email: string,
  password: string,
  name: string
) {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    throw new ConflictError("Email already in use");
  }

  const hashed = hashPassword(password);
  return prisma.user.create({
    data: { email, password: hashed, name, role: "USER" as Role },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });
}

export async function validateCredentials(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      password: true,
      role: true,
    },
  });

  if (!user) return null;

  const isValid = verifyPassword(password, user.password);
  if (!isValid) return null;

  // No devolver la contraseña
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

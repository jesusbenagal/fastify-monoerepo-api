import type { Role } from "@app/db";

import { hashPassword, verifyPassword } from "../../lib/hash";
import { prisma } from "../../lib/prisma";

export async function registerUser(
  email: string,
  password: string,
  name?: string,
) {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new Error("EMAIL_TAKEN");
  const hashed = hashPassword(password);
  return prisma.user.create({
    data: { email, password: hashed, name, role: "USER" as Role },
  });
}

export async function validateCredentials(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const ok = verifyPassword(password, user.password);
  if (!ok) return null;
  return user;
}

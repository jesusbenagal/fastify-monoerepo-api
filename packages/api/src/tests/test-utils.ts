import { buildServer } from "../server";
import type { FastifyInstance } from "fastify";

import { prisma } from "../lib/prisma";

export async function createTestApp(): Promise<FastifyInstance> {
  const app = await buildServer();
  await app.ready();
  return app;
}

export async function resetDb() {
  await prisma.post.deleteMany({});
  await prisma.user.deleteMany({});
}

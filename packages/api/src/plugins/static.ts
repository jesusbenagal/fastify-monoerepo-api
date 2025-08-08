import path from "node:path";
import { FastifyInstance } from "fastify";
import fastifyStatic from "@fastify/static";
import fs from "node:fs";

export default async function registerStatic(app: FastifyInstance) {
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  await app.register(fastifyStatic, {
    root: uploadsDir,
    prefix: "/uploads/",
    decorateReply: false,
  });
}

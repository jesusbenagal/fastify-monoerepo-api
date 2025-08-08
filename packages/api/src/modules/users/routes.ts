import { FastifyInstance } from "fastify";
import { z } from "zod";
import path from "node:path";
import fs from "node:fs";

import { prisma } from "../../lib/prisma";
import { getIO } from "../../lib/io";

import { deleteUser, getUserById, listUsers, updateUser } from "./service";

export default async function usersRoutes(app: FastifyInstance) {
  app.get("/me", { preHandler: app.auth }, async (req: any) => {
    return getUserById(req.user.sub);
  });

  app.get("/", { preHandler: app.auth }, async () => listUsers());

  app.get("/:id", { preHandler: app.auth }, async (req) => {
    const id = (req.params as any).id as string;
    return getUserById(id);
  });

  app.patch("/:id", { preHandler: app.auth }, async (req: any, reply) => {
    const id = req.params.id as string;

    if (req.user.sub !== id && req.user.role !== "ADMIN")
      return reply.code(403).send({ message: "Forbidden" });

    const schema = z.object({ name: z.string().min(1).optional() });
    const body = schema.parse(req.body);

    const res = await updateUser(id, body);

    getIO().emit("user:update", res);

    return res;
  });

  app.delete("/:id", { preHandler: app.auth }, async (req: any, reply) => {
    const id = req.params.id as string;
    if (req.user.role !== "ADMIN")
      return reply.code(403).send({ message: "ADMIN only" });
    return deleteUser(id);
  });

  app.post("/:id/avatar", { preHandler: app.auth }, async (req: any, reply) => {
    const id = req.params.id as string;
    if (req.user.sub !== id && req.user.role !== "ADMIN") {
      return reply.code(403).send({ message: "Forbidden" });
    }
    const data = await req.file({ limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB
    if (!data) return reply.code(400).send({ message: "File required" });
    const allowed = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowed.includes(data.mimetype)) {
      return reply.code(415).send({ message: "Unsupported media type" });
    }

    const ext = data.mimetype === "image/png" ? "png" : "jpg";
    const filename = `${id}-${Date.now()}.${ext}`;
    const dest = path.join(process.cwd(), "uploads", filename);

    await new Promise<void>((resolve, reject) => {
      const write = fs.createWriteStream(dest);
      data.file.pipe(write);
      write.on("finish", () => resolve());
      write.on("error", reject);
    });

    const avatarUrl = `/uploads/${filename}`;
    const user = await prisma.user.update({
      where: { id },
      data: { avatarUrl },
      select: { id: true, email: true, name: true, avatarUrl: true },
    });

    try {
      getIO().emit("user:avatar", { id: user.id, avatarUrl: user.avatarUrl });
    } catch {}

    return reply.code(201).send(user);
  });
}

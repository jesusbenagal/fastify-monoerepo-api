import { FastifyInstance } from "fastify";
import { z } from "zod";
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
    return updateUser(id, body);
  });

  app.delete("/:id", { preHandler: app.auth }, async (req: any, reply) => {
    const id = req.params.id as string;
    if (req.user.role !== "ADMIN")
      return reply.code(403).send({ message: "ADMIN only" });
    return deleteUser(id);
  });
}

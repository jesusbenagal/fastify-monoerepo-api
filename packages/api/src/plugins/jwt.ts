import jwt from "@fastify/jwt";
import { FastifyInstance } from "fastify";

export default async function registerJwt(app: FastifyInstance) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET missing");

  await app.register(jwt, {
    secret: process.env.JWT_SECRET,
  });

  app.decorate("auth", async (req, reply) => {
    try {
      await req.jwtVerify();
    } catch {
      return reply.code(401).send({ message: "Unauthorized" });
    }
  });
}

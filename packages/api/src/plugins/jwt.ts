import jwt from "@fastify/jwt";
import { FastifyInstance } from "fastify";

export default async function registerJwt(app: FastifyInstance) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required");
  }

  await app.register(jwt, {
    secret: process.env.JWT_SECRET,
  });

  app.decorate("auth", async (req: any, reply: any) => {
    try {
      await req.jwtVerify();
    } catch (err) {
      return reply.code(401).send({
        error: "AuthenticationError",
        message: "Invalid or expired token",
      });
    }
  });

  // Decorador para verificar roles
  app.decorate("requireRole", (roles: string[]) => {
    return async (req: any, reply: any) => {
      try {
        await req.jwtVerify();

        if (!roles.includes(req.user.role)) {
          return reply.code(403).send({
            error: "AuthorizationError",
            message: "Insufficient permissions",
          });
        }
      } catch (err) {
        return reply.code(401).send({
          error: "AuthenticationError",
          message: "Invalid or expired token",
        });
      }
    };
  });
}

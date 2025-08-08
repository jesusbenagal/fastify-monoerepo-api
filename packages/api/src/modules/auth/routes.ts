import { FastifyInstance } from "fastify";
import { z } from "zod";

import { registerUser, validateCredentials } from "./service";

export default async function authRoutes(app: FastifyInstance) {
  const registerSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
    name: z.string().optional(),
  });

  app.post("/register", async (req, reply) => {
    const body = registerSchema.parse(req.body);
    try {
      const user = await registerUser(body.email, body.password, body.name);

      return reply
        .code(201)
        .send({ id: user.id, email: user.email, name: user.name });
    } catch (e: any) {
      if (e.message === "EMAIL_TAKEN")
        return reply.code(409).send({ message: "Email already in use" });
      app.log.error(e);
      return reply.code(500).send({ message: "Internal error" });
    }
  });

  const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
  });

  app.post("/login", async (req: any, reply) => {
    const { email, password } = loginSchema.parse(req.body);

    const user = await validateCredentials(email, password);

    if (!user) return reply.code(401).send({ message: "Invalid credentials" });

    const token = app.jwt.sign({
      sub: user.id,
      role: user.role,
      email: user.email,
    });

    return reply.code(200).send({ accessToken: token });
  });
}

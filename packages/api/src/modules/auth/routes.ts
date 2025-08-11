import { FastifyInstance } from "fastify";

import { registerUser, validateCredentials } from "./service";
import { registerSchema, loginSchema } from "../../lib/validation";
import { ConflictError, AuthenticationError } from "../../lib/errors";

export default async function authRoutes(app: FastifyInstance) {
  app.post(
    "/register",
    {
      schema: {
        summary: "Register a new user",
        tags: ["Authentication"],
        body: {
          type: "object",
          required: ["email", "password", "name"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 8 },
            name: { type: "string", minLength: 1, maxLength: 100 },
          },
        },
        response: {
          201: {
            type: "object",
            properties: {
              id: { type: "string" },
              email: { type: "string" },
              name: { type: "string" },
            },
          },
          400: {
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" },
              details: { type: "array" },
            },
          },
          409: {
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (req, reply) => {
      try {
        const body = registerSchema.parse(req.body);
        const user = await registerUser(body.email, body.password, body.name);

        return reply.code(201).send({
          id: user.id,
          email: user.email,
          name: user.name,
        });
      } catch (error: any) {
        if (error instanceof ConflictError) {
          return reply.code(409).send({
            error: "ConflictError",
            message: error.message,
          });
        }
        throw error;
      }
    }
  );

  app.post(
    "/login",
    {
      schema: {
        summary: "Login with email/password",
        tags: ["Authentication"],
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 1 },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              accessToken: { type: "string" },
              user: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  email: { type: "string" },
                  name: { type: "string" },
                  role: { type: "string" },
                },
              },
            },
          },
          400: {
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" },
              details: { type: "array" },
            },
          },
          401: {
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (req, reply) => {
      try {
        const body = loginSchema.parse(req.body);
        const user = await validateCredentials(body.email, body.password);

        if (!user) {
          throw new AuthenticationError("Invalid credentials");
        }

        const token = app.jwt.sign({
          sub: user.id,
          role: user.role,
          email: user.email,
        });

        return reply.code(200).send({
          accessToken: token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        });
      } catch (error: any) {
        if (error instanceof AuthenticationError) {
          return reply.code(401).send({
            error: "AuthenticationError",
            message: error.message,
          });
        }
        throw error;
      }
    }
  );
}

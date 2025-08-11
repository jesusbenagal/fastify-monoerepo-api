import { FastifyInstance } from "fastify";
import path from "node:path";
import fs from "node:fs";

import { prisma } from "../../lib/prisma";
import { getIO } from "../../lib/io";
import { updateUserSchema, userIdParamSchema } from "../../lib/validation";
import { AuthorizationError, NotFoundError } from "../../lib/errors";

import { deleteUser, getUserById, listUsers, updateUser } from "./service";

export default async function usersRoutes(app: FastifyInstance) {
  app.get(
    "/me",
    {
      preHandler: app.auth,
      schema: {
        summary: "Get current user profile",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: "object",
            properties: {
              id: { type: "string" },
              email: { type: "string" },
              name: { type: "string" },
              role: { type: "string" },
              avatarUrl: { type: "string" },
              createdAt: { type: "string" },
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
    async (req: any) => {
      return getUserById(req.user.sub);
    }
  );

  app.get(
    "/",
    {
      preHandler: app.auth,
      schema: {
        summary: "List all users",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                email: { type: "string" },
                name: { type: "string" },
                role: { type: "string" },
                avatarUrl: { type: "string" },
                createdAt: { type: "string" },
              },
            },
          },
        },
      },
    },
    async () => listUsers()
  );

  app.get(
    "/:id",
    {
      preHandler: app.auth,
      schema: {
        summary: "Get user by ID",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              id: { type: "string" },
              email: { type: "string" },
              name: { type: "string" },
              role: { type: "string" },
              avatarUrl: { type: "string" },
              createdAt: { type: "string" },
            },
          },
          404: {
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (req) => {
      const params = userIdParamSchema.parse(req.params);
      return getUserById(params.id);
    }
  );

  app.patch(
    "/:id",
    {
      preHandler: app.auth,
      schema: {
        summary: "Update user profile",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
        },
        body: {
          type: "object",
          properties: {
            name: { type: "string", minLength: 1, maxLength: 100 },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              id: { type: "string" },
              email: { type: "string" },
              name: { type: "string" },
              role: { type: "string" },
              avatarUrl: { type: "string" },
              updatedAt: { type: "string" },
            },
          },
          403: {
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" },
            },
          },
          404: {
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (req: any, reply) => {
      const params = userIdParamSchema.parse(req.params);
      const body = updateUserSchema.parse(req.body);

      if (req.user.sub !== params.id && req.user.role !== "ADMIN") {
        throw new AuthorizationError("You can only update your own profile");
      }

      const res = await updateUser(params.id, body);
      getIO().emit("user:update", res);

      return res;
    }
  );

  app.delete(
    "/:id",
    {
      preHandler: app.auth,
      schema: {
        summary: "Delete user (Admin only)",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          403: {
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (req: any, reply) => {
      const params = userIdParamSchema.parse(req.params);

      if (req.user.role !== "ADMIN") {
        throw new AuthorizationError("Admin access required");
      }

      return deleteUser(params.id);
    }
  );

  app.post(
    "/:id/avatar",
    {
      preHandler: app.auth,
      schema: {
        summary: "Upload user avatar",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
        },
        consumes: ["multipart/form-data"],
        response: {
          201: {
            type: "object",
            properties: {
              id: { type: "string" },
              email: { type: "string" },
              name: { type: "string" },
              avatarUrl: { type: "string" },
            },
          },
          400: {
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" },
            },
          },
          403: {
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" },
            },
          },
          415: {
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (req: any, reply) => {
      const params = userIdParamSchema.parse(req.params);

      if (req.user.sub !== params.id && req.user.role !== "ADMIN") {
        throw new AuthorizationError("You can only update your own avatar");
      }

      const data = await req.file({ limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB
      if (!data) {
        return reply.code(400).send({
          error: "ValidationError",
          message: "File required",
        });
      }

      const allowed = ["image/png", "image/jpeg", "image/jpg"];
      if (!allowed.includes(data.mimetype)) {
        return reply.code(415).send({
          error: "UnsupportedMediaType",
          message: "Only PNG and JPEG images are allowed",
        });
      }

      // Crear directorio de uploads si no existe
      const uploadsDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const ext = data.mimetype === "image/png" ? "png" : "jpg";
      const filename = `${params.id}-${Date.now()}.${ext}`;
      const dest = path.join(uploadsDir, filename);

      await new Promise<void>((resolve, reject) => {
        const write = fs.createWriteStream(dest);
        data.file.pipe(write);
        write.on("finish", () => resolve());
        write.on("error", reject);
      });

      const avatarUrl = `/uploads/${filename}`;
      const user = await prisma.user.update({
        where: { id: params.id },
        data: { avatarUrl },
        select: { id: true, email: true, name: true, avatarUrl: true },
      });

      try {
        getIO().emit("user:avatar", { id: user.id, avatarUrl: user.avatarUrl });
      } catch {}

      return reply.code(201).send(user);
    }
  );
}

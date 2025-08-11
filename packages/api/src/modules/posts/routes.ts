import { FastifyInstance } from "fastify";

import { getIO } from "../../lib/io";
import { createPostSchema, postQuerySchema } from "../../lib/validation";

import { createPost, listPosts } from "./service";

export default async function postsRoutes(app: FastifyInstance) {
  app.get(
    "/",
    {
      schema: {
        summary: "List all posts",
        tags: ["Posts"],
        querystring: {
          type: "object",
          properties: {
            authorId: { type: "string" },
          },
        },
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                title: { type: "string" },
                content: { type: "string" },
                authorId: { type: "string" },
                author: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    email: { type: "string" },
                  },
                },
                createdAt: { type: "string" },
                updatedAt: { type: "string" },
              },
            },
          },
        },
      },
    },
    async (req) => {
      const query = postQuerySchema.parse(req.query);
      return listPosts(query.authorId);
    }
  );

  app.post(
    "/",
    {
      preHandler: app.auth,
      schema: {
        summary: "Create a new post",
        tags: ["Posts"],
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          required: ["title"],
          properties: {
            title: { type: "string", minLength: 1, maxLength: 200 },
            content: { type: "string", maxLength: 5000 },
          },
        },
        response: {
          201: {
            type: "object",
            properties: {
              id: { type: "string" },
              title: { type: "string" },
              content: { type: "string" },
              authorId: { type: "string" },
              author: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  email: { type: "string" },
                },
              },
              createdAt: { type: "string" },
              updatedAt: { type: "string" },
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
    async (req: any) => {
      const body = createPostSchema.parse(req.body);
      const post = await createPost(req.user.sub, body.title, body.content);

      try {
        getIO().emit("post:create", post);
      } catch (error) {
        // Socket.IO no está disponible en tests
        console.warn("Socket.IO not available:", error);
      }

      return post;
    }
  );
}

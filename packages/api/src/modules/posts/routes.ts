import { FastifyInstance } from "fastify";
import { z } from "zod";

import { getIO } from "../../lib/io";

import { createPost, listPosts } from "./service";

export default async function postsRoutes(app: FastifyInstance) {
  app.get("/", async (req) => {
    const authorId = (req.query as any).authorId as string | undefined;
    return listPosts(authorId);
  });

  app.post("/", { preHandler: app.auth }, async (req: any) => {
    const schema = z.object({
      title: z.string().min(1),
      content: z.string().optional(),
    });
    const body = schema.parse(req.body);

    const post = await createPost(req.user.sub, body.title, body.content);

    getIO().emit("post:create", post);

    return post;
  });
}

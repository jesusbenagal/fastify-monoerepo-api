import { FastifyInstance } from "fastify";
import { z } from "zod";
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
    return createPost(req.user.sub, body.title, body.content);
  });
}

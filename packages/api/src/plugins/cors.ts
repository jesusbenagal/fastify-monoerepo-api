import cors from "@fastify/cors";
import { FastifyInstance } from "fastify";

export default async function registerCors(app: FastifyInstance) {
  await app.register(cors, { origin: true });
}

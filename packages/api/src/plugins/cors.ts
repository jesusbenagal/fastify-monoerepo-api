import cors from "@fastify/cors";
import { FastifyInstance } from "fastify";

export default async function registerCors(app: FastifyInstance) {
  await app.register(cors, {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 86400, // 24 hours
  });
}

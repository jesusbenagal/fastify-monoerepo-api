import { FastifyInstance } from "fastify";
import rateLimit from "@fastify/rate-limit";

export default async function registerSecurity(app: FastifyInstance) {
  // Headers de seguridad básicos
  app.addHook("onRequest", async (request, reply) => {
    reply.header("X-Content-Type-Options", "nosniff");
    reply.header("X-Frame-Options", "DENY");
    reply.header("X-XSS-Protection", "1; mode=block");
    reply.header("Referrer-Policy", "strict-origin-when-cross-origin");
    reply.header(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()"
    );
    reply.header(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
  });

  // Rate limiting global
  await app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
    errorResponseBuilder: (req, context) => ({
      code: 429,
      error: "Too Many Requests",
      message: `Rate limit exceeded, retry in ${context.after}`,
      retryAfter: context.after,
    }),
  });
}

import Fastify from "fastify";
import { ZodError } from "zod";

import registerCors from "./plugins/cors";
import registerJwt from "./plugins/jwt";
import registerSwagger from "./plugins/swagger";
import registerStatic from "./plugins/static";
import registerSecurity from "./plugins/security";

import { handleError } from "./lib/errors";

export async function buildServer() {
  const isDevelopment = process.env.NODE_ENV === "development";

  const app = Fastify({
    logger: isDevelopment
      ? {
          level: process.env.LOG_LEVEL || "info",
          transport: {
            target: "pino-pretty",
            options: {
              colorize: true,
              translateTime: "HH:MM:ss Z",
              ignore: "pid,hostname",
            },
          },
        }
      : {
          level: process.env.LOG_LEVEL || "info",
        },
  });

  // Registrar plugins
  await registerSecurity(app);
  await registerCors(app);
  await registerJwt(app);
  await registerSwagger(app);
  await registerStatic(app);

  // Manejo global de errores
  app.setErrorHandler((error, request, reply) => {
    app.log.error(error);

    // Errores de validación de Zod
    if (error instanceof ZodError) {
      return reply.status(400).send({
        statusCode: 400,
        error: "ValidationError",
        message: "Invalid request data",
        details: error.issues,
      });
    }

    // Errores de Fastify
    if (error.validation) {
      return reply.status(400).send({
        statusCode: 400,
        error: "ValidationError",
        message: "Invalid request data",
        details: error.validation,
      });
    }

    if (
      error.statusCode &&
      error.constructor &&
      error.constructor.name !== "Error"
    ) {
      return reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        error: error.constructor.name,
        message: error.message,
      });
    }

    const errorResponse = handleError(error);
    return reply.status(errorResponse.statusCode).send(errorResponse);
  });

  await app.register((await import("./modules/auth/routes")).default, {
    prefix: "/auth",
  });
  await app.register((await import("./modules/users/routes")).default, {
    prefix: "/users",
  });
  await app.register((await import("./modules/posts/routes")).default, {
    prefix: "/posts",
  });

  // Health check mejorado
  app.get("/health", async () => ({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  }));

  // Ruta de información de la API
  app.get("/", async () => ({
    name: "Fastify API",
    version: "1.0.0",
    description:
      "A modern Fastify API with authentication and real-time features",
    documentation: "/docs",
    health: "/health",
  }));

  return app;
}

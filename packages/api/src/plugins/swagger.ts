import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { FastifyInstance } from "fastify";

export default async function registerSwagger(app: FastifyInstance) {
  await app.register(swagger, {
    swagger: {
      info: {
        title: "Fastify API",
        description:
          "A modern Fastify API with authentication and real-time features",
        version: "1.0.0",
        contact: {
          name: "API Support",
          email: "support@example.com",
        },
      },
      host: process.env.HOST || "localhost:3000",
      schemes: ["http", "https"],
      consumes: ["application/json"],
      produces: ["application/json"],
      securityDefinitions: {
        bearerAuth: {
          type: "apiKey",
          name: "Authorization",
          in: "header",
          description:
            "JWT Authorization header using the Bearer scheme. Example: 'Bearer {token}'",
        },
      },
      tags: [
        {
          name: "Authentication",
          description: "Authentication endpoints",
        },
        {
          name: "Users",
          description: "User management endpoints",
        },
        {
          name: "Posts",
          description: "Post management endpoints",
        },
      ],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });
}

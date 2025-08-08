import Fastify from "fastify";

import registerCors from "./plugins/cors";
import registerJwt from "./plugins/jwt";
import registerSwagger from "./plugins/swagger";
import registerStatic from "./plugins/static";

export async function buildServer() {
  const app = Fastify({ logger: true });
  await registerCors(app);
  await registerJwt(app);
  await registerSwagger(app);
  await registerStatic(app);

  await app.register((await import("./modules/auth/routes")).default, {
    prefix: "/auth",
  });
  await app.register((await import("./modules/users/routes")).default, {
    prefix: "/users",
  });
  await app.register((await import("./modules/posts/routes")).default, {
    prefix: "/posts",
  });

  app.get("/health", async () => ({ ok: true }));
  return app;
}

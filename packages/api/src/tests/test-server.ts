import { buildServer } from "../server";
import { initIO } from "../lib/io";

export async function createTestApp() {
  const app = await buildServer();

  initIO(app);

  await app.ready();
  return app;
}

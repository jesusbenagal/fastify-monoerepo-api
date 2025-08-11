import { buildServer } from "../server";

describe("Basic Server Tests", () => {
  it("should build server without errors", async () => {
    const app = await buildServer();
    expect(app).toBeDefined();
    expect(typeof app.listen).toBe("function");
    await app.close();
  });

  it("should have health endpoint", async () => {
    const app = await buildServer();
    await app.ready();

    const response = await app.inject({
      method: "GET",
      url: "/health",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveProperty("status", "ok");
    expect(response.json()).toHaveProperty("timestamp");
    expect(response.json()).toHaveProperty("uptime");
    expect(response.json()).toHaveProperty("environment");

    await app.close();
  });

  it("should have root endpoint", async () => {
    const app = await buildServer();
    await app.ready();

    const response = await app.inject({
      method: "GET",
      url: "/",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveProperty("name", "Fastify API");
    expect(response.json()).toHaveProperty("version", "1.0.0");
    expect(response.json()).toHaveProperty("documentation", "/docs");
    expect(response.json()).toHaveProperty("health", "/health");

    await app.close();
  });
});

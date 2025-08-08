import request from "supertest";
import { createTestApp, resetDb } from "./test-utils";

let app: any;

beforeAll(async () => {
  app = await createTestApp();
});
beforeEach(async () => {
  await resetDb();
});
afterAll(async () => {
  await app.close();
});

describe("Auth", () => {
  it("registers and logs in", async () => {
    const r1 = await request(app.server)
      .post("/auth/register")
      .send({ email: "a@a.com", password: "secret123", name: "A" });
    expect(r1.status).toBe(201);

    const r2 = await request(app.server)
      .post("/auth/login")
      .send({ email: "a@a.com", password: "secret123" });
    expect(r2.status).toBe(200);
    expect(r2.body.accessToken).toBeDefined();
  });

  it("rejects invalid password", async () => {
    await request(app.server)
      .post("/auth/register")
      .send({ email: "a@a.com", password: "secret123" });
    const r = await request(app.server)
      .post("/auth/login")
      .send({ email: "a@a.com", password: "nope" });
    expect(r.status).toBe(401);
  });
});

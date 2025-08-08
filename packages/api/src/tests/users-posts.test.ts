import request from "supertest";
import { createTestApp, resetDb } from "./test-utils";

let app: any;
let token = "";
let userId = "";

beforeAll(async () => {
  app = await createTestApp();
  await resetDb();
  await request(app.server)
    .post("/auth/register")
    .send({ email: "u@u.com", password: "secret123", name: "U" });
  const login = await request(app.server)
    .post("/auth/login")
    .send({ email: "u@u.com", password: "secret123" });
  token = login.body.accessToken;
  const me = await request(app.server)
    .get("/users/me")
    .set("Authorization", `Bearer ${token}`);
  userId = me.body.id;
});

afterAll(async () => {
  await app.close();
});

describe("Users & Posts", () => {
  it("updates my profile name", async () => {
    const r = await request(app.server)
      .patch(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Updated" });
    expect(r.status).toBe(200);
    expect(r.body.name).toBe("Updated");
  });

  it("creates a post and lists it", async () => {
    const c = await request(app.server)
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Hello", content: "world" });
    expect(c.status).toBe(200);
    const list = await request(app.server).get("/posts");
    expect(list.status).toBe(200);
    expect(list.body.length).toBe(1);
    expect(list.body[0].title).toBe("Hello");
  });
});

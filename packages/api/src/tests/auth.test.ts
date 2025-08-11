import request from "supertest";
import { createTestApp, resetDb, createTestUser } from "./test-utils";

let app: any;

beforeAll(async () => {
  app = await createTestApp();
});

beforeEach(async () => {
  await resetDb();
});

afterAll(async () => {
  if (app) {
    await app.close();
  }
});

describe("Auth", () => {
  describe("POST /auth/register", () => {
    it("should register a new user successfully", async () => {
      const response = await request(app.server).post("/auth/register").send({
        email: "newuser@example.com",
        password: "password123",
        name: "Test User",
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.email).toBe("newuser@example.com");
      expect(response.body.name).toBe("Test User");
      expect(response.body).not.toHaveProperty("password");
    });

    it("should reject registration with invalid email", async () => {
      const response = await request(app.server).post("/auth/register").send({
        email: "invalid-email",
        password: "password123",
        name: "Test User",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("ValidationError");
    });

    it("should reject registration with short password", async () => {
      const response = await request(app.server).post("/auth/register").send({
        email: "test@example.com",
        password: "123",
        name: "Test User",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("ValidationError");
    });

    it("should reject duplicate email registration", async () => {
      await createTestUser("test@example.com");

      const response = await request(app.server).post("/auth/register").send({
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      });

      expect(response.status).toBe(409);
      expect(response.body.error).toBe("AppError");
    });
  });

  describe("POST /auth/login", () => {
    beforeEach(async () => {
      await createTestUser("test@example.com", "password123", "Test User");
    });

    it("should login successfully with valid credentials", async () => {
      const response = await request(app.server).post("/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("accessToken");
      expect(response.body).toHaveProperty("user");
      expect(response.body.user.email).toBe("test@example.com");
      expect(response.body.user.name).toBe("Test User");
    });

    it("should reject login with invalid password", async () => {
      const response = await request(app.server).post("/auth/login").send({
        email: "test@example.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("AppError");
    });

    it("should reject login with non-existent email", async () => {
      const response = await request(app.server).post("/auth/login").send({
        email: "nonexistent@example.com",
        password: "password123",
      });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("AppError");
    });

    it("should reject login with invalid email format", async () => {
      const response = await request(app.server).post("/auth/login").send({
        email: "invalid-email",
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("ValidationError");
    });
  });
});

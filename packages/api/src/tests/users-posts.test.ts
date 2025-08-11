import request from "supertest";
import {
  createTestApp,
  resetDb,
  createTestUser,
  createTestPost,
} from "./test-utils";

let app: any;
let testUser: any;
let authToken: string;

beforeAll(async () => {
  app = await createTestApp();
});

beforeEach(async () => {
  await resetDb();
  testUser = await createTestUser(
    "test@example.com",
    "password123",
    "Test User"
  );

  // Login to get auth token
  const loginResponse = await request(app.server)
    .post("/auth/login")
    .send({ email: "test@example.com", password: "password123" });

  authToken = loginResponse.body.accessToken;
});

afterAll(async () => {
  if (app) {
    await app.close();
  }
});

describe("Users", () => {
  describe("GET /users/me", () => {
    it("should get current user profile", async () => {
      const response = await request(app.server)
        .get("/users/me")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(testUser.id);
      expect(response.body.email).toBe("test@example.com");
      expect(response.body.name).toBe("Test User");
    });

    it("should reject request without token", async () => {
      const response = await request(app.server).get("/users/me");

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("AuthenticationError");
    });
  });

  describe("GET /users", () => {
    it("should list all users", async () => {
      await createTestUser("user2@example.com", "password123", "User 2");

      const response = await request(app.server)
        .get("/users")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty("id");
      expect(response.body[0]).toHaveProperty("email");
      expect(response.body[0]).toHaveProperty("name");
    });
  });

  describe("GET /users/:id", () => {
    it("should get user by ID", async () => {
      const response = await request(app.server)
        .get(`/users/${testUser.id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(testUser.id);
      expect(response.body.email).toBe("test@example.com");
    });

    it("should return 404 for non-existent user", async () => {
      const response = await request(app.server)
        .get("/users/cme3y1jnp0007kkwwx3l4zuw5")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("NotFoundError");
    });
  });

  describe("PATCH /users/:id", () => {
    it("should update user profile", async () => {
      const response = await request(app.server)
        .patch(`/users/${testUser.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ name: "Updated Name" });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Updated Name");
      expect(response.body.email).toBe("test@example.com");
    });

    it("should reject updating other user's profile", async () => {
      const otherUser = await createTestUser(
        "other@example.com",
        "password123",
        "Other User"
      );

      const response = await request(app.server)
        .patch(`/users/${otherUser.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ name: "Updated Name" });

      expect(response.status).toBe(403);
      expect(response.body.error).toBe("AppError");
    });
  });
});

describe("Posts", () => {
  describe("GET /posts", () => {
    it("should list all posts", async () => {
      await createTestPost(testUser.id, "Test Post 1", "Content 1");
      await createTestPost(testUser.id, "Test Post 2", "Content 2");

      const response = await request(app.server).get("/posts");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty("title");
      expect(response.body[0]).toHaveProperty("author");
    });

    it("should filter posts by author", async () => {
      const otherUser = await createTestUser(
        "other@example.com",
        "password123",
        "Other User"
      );
      await createTestPost(testUser.id, "My Post", "My content");
      await createTestPost(otherUser.id, "Other Post", "Other content");

      const response = await request(app.server)
        .get("/posts")
        .query({ authorId: testUser.id });

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe("My Post");
    });
  });

  describe("POST /posts", () => {
    it("should create a new post", async () => {
      const response = await request(app.server)
        .post("/posts")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ title: "New Post", content: "Post content" });

      expect(response.status).toBe(201);
      expect(response.body.title).toBe("New Post");
      expect(response.body.content).toBe("Post content");
      expect(response.body.authorId).toBe(testUser.id);
      expect(response.body.author).toBeDefined();
    });

    it("should reject post creation without authentication", async () => {
      const response = await request(app.server)
        .post("/posts")
        .send({ title: "New Post", content: "Post content" });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("AuthenticationError");
    });

    it("should reject post with empty title", async () => {
      const response = await request(app.server)
        .post("/posts")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ title: "", content: "Post content" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("ValidationError");
    });
  });
});

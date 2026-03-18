import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import createApp from "../app";
import { prisma } from "../prisma";

const app = createApp();

describe("User API CRUD flow", () => {
  beforeEach(async () => {
    // Ensure a clean state before each test
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("GET /health returns status ok", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("GET /api/users initially returns an array (empty)", async () => {
    const res = await request(app).get("/api/users");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(0);
  });

  it("full CRUD happy path for User", async () => {
    // Create user
    const createRes = await request(app)
      .post("/api/users")
      .send({ email: "test@example.com", name: "Test User" });

    expect(createRes.status).toBe(201);
    expect(createRes.body).toMatchObject({
      id: expect.any(Number),
      email: "test@example.com",
      name: "Test User",
    });

    const createdUserId = createRes.body.id as number;

    // Get by id
    const getRes = await request(app).get(`/api/users/${createdUserId}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body).toMatchObject({
      id: createdUserId,
      email: "test@example.com",
      name: "Test User",
    });

    // Update user
    const updateRes = await request(app)
      .put(`/api/users/${createdUserId}`)
      .send({ name: "Updated User" });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body).toMatchObject({
      id: createdUserId,
      email: "test@example.com",
      name: "Updated User",
    });

    // Delete user
    const deleteRes = await request(app).delete(`/api/users/${createdUserId}`);
    expect(deleteRes.status).toBe(204);
    expect(deleteRes.body).toEqual({});

    // Verify 404 after delete
    const getAfterDeleteRes = await request(app).get(
      `/api/users/${createdUserId}`
    );
    expect(getAfterDeleteRes.status).toBe(404);
  });

  it("returns 400 when creating a user without email", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ name: "No Email" });

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({
      error: "'email' is required and must be a string",
    });
  });
});

import request from "supertest";
import createApp from "../app";
import { prisma } from "../prisma";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

const app = createApp();

beforeEach(async () => {
  await prisma.todo.deleteMany({});
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Todo API", () => {
  it("should return empty list initially", async () => {
    const res = await request(app).get("/api/todos");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it("should create, read, update, toggle and delete a todo", async () => {
    // create
    const createRes = await request(app)
      .post("/api/todos")
      .send({ title: "Test todo", description: "Test description" });
    expect(createRes.status).toBe(201);
    const todo = createRes.body;
    expect(todo.title).toBe("Test todo");
    expect(todo.description).toBe("Test description");
    expect(todo.completed).toBe(false);

    const id = todo.id;

    // get by id
    const getRes = await request(app).get(`/api/todos/${id}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.id).toBe(id);

    // update
    const updateRes = await request(app)
      .put(`/api/todos/${id}`)
      .send({ title: "Updated", completed: true });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.title).toBe("Updated");
    expect(updateRes.body.completed).toBe(true);

    // toggle
    const toggleRes = await request(app).patch(`/api/todos/${id}/toggle`);
    expect(toggleRes.status).toBe(200);
    expect(toggleRes.body.completed).toBe(false);

    // delete
    const deleteRes = await request(app).delete(`/api/todos/${id}`);
    expect(deleteRes.status).toBe(204);

    const getAfterDelete = await request(app).get(`/api/todos/${id}`);
    expect(getAfterDelete.status).toBe(404);
  });

  it("should filter todos by status", async () => {
    await prisma.todo.create({ data: { title: "Completed", completed: true } });
    await prisma.todo.create({ data: { title: "Pending", completed: false } });

    const completedRes = await request(app).get("/api/todos?status=completed");
    expect(completedRes.status).toBe(200);
    expect(completedRes.body.every((t: any) => t.completed)).toBe(true);

    const pendingRes = await request(app).get("/api/todos?status=pending");
    expect(pendingRes.status).toBe(200);
    expect(pendingRes.body.every((t: any) => !t.completed)).toBe(true);
  });

  it("should validate title on create", async () => {
    const res = await request(app).post("/api/todos").send({});
    expect(res.status).toBe(400);
  });
});

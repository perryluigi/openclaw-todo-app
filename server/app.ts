import express, { Request, Response } from "express";
import { prisma } from "./prisma";

export const createApp = () => {
  const app = express();

  app.use(express.json());

  // Health check
  app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  // GET /api/users - return all users
  app.get("/api/users", async (_req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // POST /api/users - create a new user
  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const { email, name } = req.body ?? {};

      if (!email || typeof email !== "string") {
        return res
          .status(400)
          .json({ error: "'email' is required and must be a string" });
      }

      try {
        const user = await prisma.user.create({
          data: { email, name },
        });
        return res.status(201).json(user);
      } catch (error: any) {
        // Handle unique constraint violations etc.
        if (error?.code === "P2002") {
          return res
            .status(400)
            .json({ error: "A user with this email already exists" });
        }
        console.error("Error creating user", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    } catch (error) {
      console.error("Unexpected error in POST /api/users", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // GET /api/users/:id - get a user by id
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    try {
      const user = await prisma.user.findUnique({ where: { id } });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json(user);
    } catch (error) {
      console.error("Error fetching user", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // PUT /api/users/:id - update a user
  app.put("/api/users/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const { email, name } = req.body ?? {};

    if (email !== undefined && typeof email !== "string") {
      return res
        .status(400)
        .json({ error: "'email' must be a string if provided" });
    }

    if (name !== undefined && typeof name !== "string") {
      return res
        .status(400)
        .json({ error: "'name' must be a string if provided" });
    }

    try {
      // First check if the user exists
      const existing = await prisma.user.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ error: "User not found" });
      }

      try {
        const updated = await prisma.user.update({
          where: { id },
          data: { email, name },
        });
        return res.json(updated);
      } catch (error: any) {
        if (error?.code === "P2002") {
          return res
            .status(400)
            .json({ error: "A user with this email already exists" });
        }
        console.error("Error updating user", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    } catch (error) {
      console.error("Unexpected error in PUT /api/users/:id", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // DELETE /api/users/:id - delete a user
  app.delete("/api/users/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    try {
      // Check if user exists
      const existing = await prisma.user.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ error: "User not found" });
      }

      await prisma.user.delete({ where: { id } });

      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting user", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // --- Todo routes ---

  // GET /api/todos - list all todos with optional status filter
  app.get("/api/todos", async (req: Request, res: Response) => {
    const status = (req.query.status as string | undefined)?.toLowerCase();

    let where: { completed?: boolean } = {};
    if (status === "completed") {
      where.completed = true;
    } else if (status === "pending") {
      where.completed = false;
    }

    try {
      const todos = await prisma.todo.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });
      res.json(todos);
    } catch (error) {
      console.error("Error fetching todos", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // POST /api/todos - create a new todo
  app.post("/api/todos", async (req: Request, res: Response) => {
    const { title, description } = req.body ?? {};

    if (!title || typeof title !== "string") {
      return res
        .status(400)
        .json({ error: "'title' is required and must be a string" });
    }

    if (description !== undefined && typeof description !== "string") {
      return res
        .status(400)
        .json({ error: "'description' must be a string if provided" });
    }

    try {
      const todo = await prisma.todo.create({
        data: { title, description },
      });
      res.status(201).json(todo);
    } catch (error) {
      console.error("Error creating todo", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // GET /api/todos/:id - get single todo
  app.get("/api/todos/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid todo id" });
    }

    try {
      const todo = await prisma.todo.findUnique({ where: { id } });
      if (!todo) {
        return res.status(404).json({ error: "Todo not found" });
      }
      res.json(todo);
    } catch (error) {
      console.error("Error fetching todo", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // PUT /api/todos/:id - update a todo
  app.put("/api/todos/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid todo id" });
    }

    const { title, description, completed } = req.body ?? {};

    if (title !== undefined && typeof title !== "string") {
      return res
        .status(400)
        .json({ error: "'title' must be a string if provided" });
    }

    if (description !== undefined && typeof description !== "string") {
      return res
        .status(400)
        .json({ error: "'description' must be a string if provided" });
    }

    if (completed !== undefined && typeof completed !== "boolean") {
      return res
        .status(400)
        .json({ error: "'completed' must be a boolean if provided" });
    }

    try {
      const existing = await prisma.todo.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ error: "Todo not found" });
      }

      const updated = await prisma.todo.update({
        where: { id },
        data: { title, description, completed },
      });

      res.json(updated);
    } catch (error) {
      console.error("Error updating todo", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // DELETE /api/todos/:id - delete a todo
  app.delete("/api/todos/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid todo id" });
    }

    try {
      const existing = await prisma.todo.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ error: "Todo not found" });
      }

      await prisma.todo.delete({ where: { id } });
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting todo", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // PATCH /api/todos/:id/toggle - toggle completed status
  app.patch("/api/todos/:id/toggle", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid todo id" });
    }

    try {
      const existing = await prisma.todo.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ error: "Todo not found" });
      }

      const updated = await prisma.todo.update({
        where: { id },
        data: { completed: !existing.completed },
      });

      res.json(updated);
    } catch (error) {
      console.error("Error toggling todo", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return app;
};

export default createApp;

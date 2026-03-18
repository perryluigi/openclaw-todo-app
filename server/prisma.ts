import { PrismaClient } from "@prisma/client";

// Create a single shared PrismaClient instance
export const prisma = new PrismaClient();

// Helper to gracefully shut down Prisma when the process exits
export const setupPrismaShutdownHooks = () => {
  const shutdown = async () => {
    try {
      await prisma.$disconnect();
    } catch (err) {
      console.error("Error disconnecting Prisma client", err);
    } finally {
      process.exit(0);
    }
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

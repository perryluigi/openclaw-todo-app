import createApp from "./app.ts";
import { setupPrismaShutdownHooks } from "./prisma.ts";

const app = createApp();
const PORT = Number(process.env.PORT) || 3001;

// Setup Prisma shutdown hooks
setupPrismaShutdownHooks();

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

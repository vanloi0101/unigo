import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

// Handle Prisma Client disconnect on app termination
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;

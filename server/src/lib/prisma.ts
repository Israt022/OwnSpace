import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

/**
 * Singleton Prisma 7 Client configured with the @prisma/adapter-pg driver adapter.
 *
 * Prevents multiple instances of PrismaClient in development caused by Next.js
 * hot-reloading (HMR), avoiding PostgreSQL connection pool exhaustion.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set in environment variables. Please check your .env file."
    );
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;

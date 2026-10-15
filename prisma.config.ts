import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // DIRECT_URL bypasses pgbouncer — required for Prisma Migrate with Supabase.
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});

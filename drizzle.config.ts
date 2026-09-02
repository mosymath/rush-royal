import { defineConfig } from "drizzle-kit";

// Local zero-config database. The file is created automatically on first run;
// no external database server is required.
const dbPath = process.env.DATABASE_PATH ?? "./data/mosy-math.db";

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: dbPath,
  },
});

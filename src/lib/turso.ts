import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../db/schema";

if (typeof window !== "undefined") {
  throw new Error("lib/turso can only be imported on the server");
}

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  throw new Error("TURSO_DATABASE_URL is not set. Add it to your .env.local");
}

const client = createClient({
  url,
  authToken,
});

export const db = drizzle(client, { schema });

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const rawUrl = process.env.DATABASE_URL || "file:sqlite.db";

const connectionUrl =
  rawUrl.startsWith("file:") ||
  rawUrl.startsWith("libsql:") ||
  rawUrl.startsWith("http:") ||
  rawUrl.startsWith("https:")
    ? rawUrl
    : `file:${rawUrl}`;

export const client = createClient({
  url: connectionUrl,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
export * from "./schema";

import { drizzle } from "drizzle-orm/d1";
import * as coreSchema from "./schema";
import * as adminSchema from "./admin-schema";

const schema = { ...coreSchema, ...adminSchema };

export async function getDb() {
  const { env } = await import("cloudflare:workers");

  if (!env.DB) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Set the `d1` field in .openai/hosting.json to `DB` or let your control plane inject the real binding values before using the database."
    );
  }

  return drizzle(env.DB, { schema });
}

import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { isLoopbackDatabaseUrl } from '../config/defaults.js';
import { env } from '../config/env.js';
import * as schema from './schema.js';

const local = isLoopbackDatabaseUrl(env.DATABASE_URL);

export const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  max: 5,
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 5_000,
  ssl: local ? false : { rejectUnauthorized: true },
});

export const db = drizzle(pool, { schema });

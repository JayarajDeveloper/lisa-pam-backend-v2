import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { DEFAULT_DATABASE_URL } from './src/config/defaults.ts';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? DEFAULT_DATABASE_URL,
  },
});

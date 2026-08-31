import { config as loadEnv } from 'dotenv';
import { z } from 'zod';
import { DEFAULT_DATABASE_URL } from './defaults.js';

loadEnv();

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().url().default(DEFAULT_DATABASE_URL),
});

export const env = schema.parse(process.env);

if (env.NODE_ENV === 'production' && env.DATABASE_URL === DEFAULT_DATABASE_URL) {
  throw new Error('Set DATABASE_URL before running in production.');
}

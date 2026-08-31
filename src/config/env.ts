import { config as loadEnv } from 'dotenv';
import { z } from 'zod';

loadEnv();

const schema = z.object({
  DATABASE_URL: z
    .string()
    .url()
    .default('postgres://lisa:lisa@127.0.0.1:55432/lisa_pam_v2'),
});

export const env = schema.parse(process.env);

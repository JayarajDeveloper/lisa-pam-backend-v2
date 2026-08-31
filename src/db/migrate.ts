import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db, pool } from './client.js';

async function main(): Promise<void> {
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('Migrations applied.');
  await pool.end();
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});

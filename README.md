# lisa-pam-backend-v2

Postgres schema for the LISA-PAM ops fleet: **devices**, **telemetry**, **captures**, **consumables**, **alerts**.

```
src/config/     env + local defaults
src/db/         schema, pool, migrate
drizzle/        SQL migrations (committed)
```

```bash
cp .env.example .env
npm install
npm run db:up          # Postgres 16 on 127.0.0.1:55432
npm run db:migrate
```

Port **55432** is bound to loopback only so it does not clash with Lisa-App on 5432 and is not exposed on the LAN.

After a schema change: `npm run db:generate` then `npm run db:migrate`.

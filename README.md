# lisa-pam-backend-v2

Postgres schema for the LISA-PAM ops fleet: **devices**, **telemetry**, **captures**, **consumables**, **alerts**.

## Run

```bash
cp .env.example .env
npm install
npm run db:up          # Postgres 16 on localhost:55432
npm run db:migrate
```

`DATABASE_URL` defaults to `postgres://lisa:lisa@127.0.0.1:55432/lisa_pam_v2`. Port **55432** is intentional so this does not collide with the Lisa-App database on 5432.

## Schema

| Table | Role |
| --- | --- |
| `devices` | Factory id (`lisa-pam-001`), name, tier, firmware, location |
| `telemetry` | `temp`, `humidity`, `pressure`, `lux`, `rain`, `vbat`, `fan_pwm`, `uptime` |
| `captures` | `edge_class`, `cloud_class`, `sex`, `img_id`, `wingbeat_hz` |
| `consumables` | lure / co2 / bag remaining |
| `alerts` | severity + message, optional device |

After a schema change: `npm run db:generate` then `npm run db:migrate`.

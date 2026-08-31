import {
  bigint,
  boolean,
  check,
  doublePrecision,
  index,
  integer,
  pgTable,
  real,
  smallint,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

/** Factory id (lisa-pam-001), not a UUID. */
const timestamptz = (name: string) => timestamp(name, { withTimezone: true, mode: 'date' });

const serialId = () =>
  bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity();

export const devices = pgTable(
  'devices',
  {
    id: text('id').primaryKey(),
    displayName: text('display_name').notNull(),
    tier: text('tier').notNull().default('b2c'),
    fwVer: text('fw_ver'),
    lat: doublePrecision('lat'),
    lon: doublePrecision('lon'),
    createdAt: timestamptz('created_at').notNull().defaultNow(),
    updatedAt: timestamptz('updated_at').notNull().defaultNow(),
  },
  (table) => [check('devices_tier_check', sql`${table.tier} IN ('b2c', 'b2b', 'b2g')`)],
);

const deviceId = (onDelete: 'cascade' | 'set null') =>
  text('device_id').references(() => devices.id, { onDelete });

export const telemetry = pgTable(
  'telemetry',
  {
    id: serialId(),
    deviceId: deviceId('cascade').notNull(),
    ts: timestamptz('ts').notNull(),
    temp: real('temp'),
    humidity: real('humidity'),
    pressure: real('pressure'),
    lux: real('lux'),
    rain: boolean('rain'),
    vbat: real('vbat'),
    fanPwm: smallint('fan_pwm'),
    uptime: integer('uptime'),
  },
  (table) => [
    index('telemetry_device_ts_idx').on(table.deviceId, table.ts.desc()),
    check(
      'telemetry_fan_pwm_range',
      sql`${table.fanPwm} IS NULL OR (${table.fanPwm} >= 0 AND ${table.fanPwm} <= 255)`,
    ),
  ],
);

export const captures = pgTable(
  'captures',
  {
    id: serialId(),
    deviceId: deviceId('cascade').notNull(),
    ts: timestamptz('ts').notNull(),
    edgeClass: text('edge_class'),
    cloudClass: text('cloud_class'),
    sex: text('sex'),
    imgId: text('img_id'),
    wingbeatHz: real('wingbeat_hz'),
  },
  (table) => [
    index('captures_device_ts_idx').on(table.deviceId, table.ts.desc()),
    check('captures_sex_check', sql`${table.sex} IS NULL OR ${table.sex} IN ('f', 'm', 'unknown')`),
  ],
);

export const consumables = pgTable(
  'consumables',
  {
    id: serialId(),
    deviceId: deviceId('cascade').notNull(),
    kind: text('kind').notNull(),
    installedAt: timestamptz('installed_at').notNull().defaultNow(),
    expiresAt: timestamptz('expires_at'),
    remainingPct: real('remaining_pct'),
  },
  (table) => [
    index('consumables_device_idx').on(table.deviceId),
    check('consumables_kind_check', sql`${table.kind} IN ('lure', 'co2', 'bag')`),
    check(
      'consumables_remaining_pct_range',
      sql`${table.remainingPct} IS NULL OR (${table.remainingPct} >= 0 AND ${table.remainingPct} <= 100)`,
    ),
  ],
);

export const alerts = pgTable(
  'alerts',
  {
    id: serialId(),
    deviceId: deviceId('set null'),
    type: text('type').notNull(),
    severity: text('severity').notNull().default('info'),
    message: text('message'),
    createdAt: timestamptz('created_at').notNull().defaultNow(),
  },
  (table) => [
    index('alerts_device_created_idx').on(table.deviceId, table.createdAt.desc()),
    index('alerts_created_idx').on(table.createdAt.desc()),
    check('alerts_severity_check', sql`${table.severity} IN ('critical', 'warning', 'info')`),
  ],
);

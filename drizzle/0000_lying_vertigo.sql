CREATE TABLE "alerts" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "alerts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"device_id" text,
	"type" text NOT NULL,
	"severity" text DEFAULT 'info' NOT NULL,
	"message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "alerts_severity_check" CHECK ("alerts"."severity" IN ('critical', 'warning', 'info'))
);
--> statement-breakpoint
CREATE TABLE "captures" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "captures_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"device_id" text NOT NULL,
	"ts" timestamp with time zone NOT NULL,
	"edge_class" text,
	"cloud_class" text,
	"sex" text,
	"img_id" text,
	"wingbeat_hz" real,
	CONSTRAINT "captures_sex_check" CHECK ("captures"."sex" IS NULL OR "captures"."sex" IN ('f', 'm', 'unknown'))
);
--> statement-breakpoint
CREATE TABLE "consumables" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "consumables_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"device_id" text NOT NULL,
	"kind" text NOT NULL,
	"installed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone,
	"remaining_pct" real,
	CONSTRAINT "consumables_kind_check" CHECK ("consumables"."kind" IN ('lure', 'co2', 'bag')),
	CONSTRAINT "consumables_remaining_pct_range" CHECK ("consumables"."remaining_pct" IS NULL OR ("consumables"."remaining_pct" >= 0 AND "consumables"."remaining_pct" <= 100))
);
--> statement-breakpoint
CREATE TABLE "devices" (
	"id" text PRIMARY KEY NOT NULL,
	"display_name" text NOT NULL,
	"tier" text DEFAULT 'b2c' NOT NULL,
	"fw_ver" text,
	"lat" double precision,
	"lon" double precision,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "devices_tier_check" CHECK ("devices"."tier" IN ('b2c', 'b2b', 'b2g'))
);
--> statement-breakpoint
CREATE TABLE "telemetry" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "telemetry_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"device_id" text NOT NULL,
	"ts" timestamp with time zone NOT NULL,
	"temp" real,
	"humidity" real,
	"pressure" real,
	"lux" real,
	"rain" boolean,
	"vbat" real,
	"fan_pwm" smallint,
	"uptime" integer,
	CONSTRAINT "telemetry_fan_pwm_range" CHECK ("telemetry"."fan_pwm" IS NULL OR ("telemetry"."fan_pwm" >= 0 AND "telemetry"."fan_pwm" <= 255))
);
--> statement-breakpoint
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_device_id_devices_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."devices"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "captures" ADD CONSTRAINT "captures_device_id_devices_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."devices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consumables" ADD CONSTRAINT "consumables_device_id_devices_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."devices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "telemetry" ADD CONSTRAINT "telemetry_device_id_devices_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."devices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "alerts_device_created_idx" ON "alerts" USING btree ("device_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "alerts_created_idx" ON "alerts" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "captures_device_ts_idx" ON "captures" USING btree ("device_id","ts" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "consumables_device_idx" ON "consumables" USING btree ("device_id");--> statement-breakpoint
CREATE INDEX "telemetry_device_ts_idx" ON "telemetry" USING btree ("device_id","ts" DESC NULLS LAST);
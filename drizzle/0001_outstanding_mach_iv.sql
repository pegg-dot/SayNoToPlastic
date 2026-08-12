CREATE TABLE `analytics_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_name` text NOT NULL,
	`path` text NOT NULL,
	`label` text,
	`destination` text,
	`session_id` text,
	`referrer` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `email_outbox` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`kind` text NOT NULL,
	`recipient` text NOT NULL,
	`payload` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`provider_id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`sent_at` text
);
--> statement-breakpoint
ALTER TABLE `contact_inquiries` ADD `delivery_status` text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE `subscribers` ADD `provider_status` text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE `subscribers` ADD `provider_id` text;--> statement-breakpoint
ALTER TABLE `subscribers` ADD `consent_version` text DEFAULT '2026-08-03' NOT NULL;--> statement-breakpoint
ALTER TABLE `subscribers` ADD `consent_at` text;

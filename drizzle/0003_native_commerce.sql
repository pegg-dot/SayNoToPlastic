CREATE TABLE `commerce_orders` (
	`id` text PRIMARY KEY NOT NULL,
	`product_key` text NOT NULL,
	`provider` text DEFAULT 'stripe' NOT NULL,
	`provider_session_id` text,
	`provider_payment_intent_id` text,
	`customer_email` text,
	`amount_total` integer,
	`currency` text DEFAULT 'usd' NOT NULL,
	`source` text DEFAULT 'unknown' NOT NULL,
	`status` text DEFAULT 'checkout_creating' NOT NULL,
	`access_state` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`paid_at` text,
	`fulfilled_at` text,
	`refunded_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `commerce_orders_provider_session_unique` ON `commerce_orders` (`provider_session_id`);
--> statement-breakpoint
CREATE INDEX `commerce_orders_email_idx` ON `commerce_orders` (`customer_email`);
--> statement-breakpoint
CREATE INDEX `commerce_orders_status_idx` ON `commerce_orders` (`status`);
--> statement-breakpoint
CREATE INDEX `commerce_orders_created_idx` ON `commerce_orders` (`created_at`);
--> statement-breakpoint
CREATE TABLE `commerce_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`provider` text NOT NULL,
	`provider_event_id` text NOT NULL,
	`event_type` text NOT NULL,
	`order_id` text,
	`payload_hash` text NOT NULL,
	`status` text DEFAULT 'received' NOT NULL,
	`error` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`claimed_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`processed_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `commerce_events_provider_event_unique` ON `commerce_events` (`provider`,`provider_event_id`);
--> statement-breakpoint
CREATE INDEX `commerce_events_order_idx` ON `commerce_events` (`order_id`);
--> statement-breakpoint
CREATE INDEX `commerce_events_created_idx` ON `commerce_events` (`created_at`);
--> statement-breakpoint
CREATE TABLE `commerce_fulfillments` (
	`order_id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`state` text DEFAULT 'pending' NOT NULL,
	`provider_id` text,
	`error` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`sent_at` text
);
--> statement-breakpoint
CREATE TABLE `ebook_downloads` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` text NOT NULL,
	`channel` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `ebook_downloads_order_idx` ON `ebook_downloads` (`order_id`);
--> statement-breakpoint
CREATE INDEX `ebook_downloads_created_idx` ON `ebook_downloads` (`created_at`);
--> statement-breakpoint
CREATE TABLE `recovery_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email_hash` text NOT NULL,
	`order_id` text,
	`status` text DEFAULT 'received' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `recovery_requests_email_created_idx` ON `recovery_requests` (`email_hash`,`created_at`);

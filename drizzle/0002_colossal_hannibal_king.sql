CREATE INDEX `analytics_events_name_idx` ON `analytics_events` (`event_name`);--> statement-breakpoint
CREATE INDEX `analytics_events_created_idx` ON `analytics_events` (`created_at`);--> statement-breakpoint
CREATE INDEX `contact_inquiries_created_idx` ON `contact_inquiries` (`created_at`);--> statement-breakpoint
CREATE INDEX `email_outbox_status_idx` ON `email_outbox` (`status`);--> statement-breakpoint
CREATE INDEX `email_outbox_created_idx` ON `email_outbox` (`created_at`);
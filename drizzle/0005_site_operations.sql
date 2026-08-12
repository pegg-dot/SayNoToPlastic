ALTER TABLE `subscribers` ADD `unsubscribe_token_hash` text;
--> statement-breakpoint
ALTER TABLE `subscribers` ADD `unsubscribed_at` text;
--> statement-breakpoint
ALTER TABLE `subscribers` ADD `updated_at` text;
--> statement-breakpoint
UPDATE `subscribers`
SET `updated_at` = COALESCE(`consent_at`, `created_at`)
WHERE `updated_at` IS NULL;
--> statement-breakpoint
CREATE UNIQUE INDEX `subscribers_unsubscribe_token_unique` ON `subscribers` (`unsubscribe_token_hash`);
--> statement-breakpoint
ALTER TABLE `email_outbox` ADD `claimed_at` text;
--> statement-breakpoint
ALTER TABLE `email_outbox` ADD `updated_at` text;
--> statement-breakpoint
ALTER TABLE `email_outbox` ADD `attempt_count` integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE `email_outbox` ADD `last_error` text;
--> statement-breakpoint
ALTER TABLE `email_outbox` ADD `next_attempt_at` text;
--> statement-breakpoint
UPDATE `email_outbox`
SET
  `updated_at` = COALESCE(`sent_at`, `created_at`),
  `attempt_count` = CASE WHEN `status` = 'sent' THEN 1 ELSE 0 END
WHERE `updated_at` IS NULL;
--> statement-breakpoint
CREATE INDEX `email_outbox_next_attempt_idx` ON `email_outbox` (`status`, `next_attempt_at`);

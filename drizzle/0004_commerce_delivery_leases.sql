ALTER TABLE `commerce_fulfillments` ADD `claimed_at` text;
--> statement-breakpoint
ALTER TABLE `commerce_fulfillments` ADD `updated_at` text;
--> statement-breakpoint
ALTER TABLE `commerce_fulfillments` ADD `attempt_count` integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
UPDATE `commerce_fulfillments`
SET
  `claimed_at` = COALESCE(`sent_at`, `created_at`),
  `updated_at` = COALESCE(`sent_at`, `created_at`),
  `attempt_count` = CASE WHEN `state` = 'pending' THEN 0 ELSE 1 END;

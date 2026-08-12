CREATE TABLE `learning_series_enrollments` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `email` text NOT NULL,
  `sequence_key` text NOT NULL,
  `status` text DEFAULT 'active' NOT NULL,
  `next_step` integer DEFAULT 1 NOT NULL,
  `started_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `completed_at` text,
  `updated_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `learning_series_email_sequence_unique` ON `learning_series_enrollments` (`email`,`sequence_key`);
--> statement-breakpoint
CREATE INDEX `learning_series_status_idx` ON `learning_series_enrollments` (`status`,`updated_at`);

CREATE TABLE `admin_content` (
  `key` text PRIMARY KEY NOT NULL,
  `value` text NOT NULL,
  `version` integer DEFAULT 1 NOT NULL,
  `updated_by` text NOT NULL,
  `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `admin_content_revisions` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `key` text NOT NULL,
  `value` text NOT NULL,
  `version` integer NOT NULL,
  `updated_by` text NOT NULL,
  `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `admin_content_revisions_key_idx` ON `admin_content_revisions` (`key`,`created_at`);

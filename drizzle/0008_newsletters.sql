CREATE TABLE `newsletters` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `slug` text NOT NULL,
  `title` text NOT NULL,
  `excerpt` text NOT NULL DEFAULT '',
  `source_filename` text NOT NULL,
  `source_format` text NOT NULL DEFAULT 'docx',
  `content_html` text NOT NULL,
  `published` integer NOT NULL DEFAULT 0,
  `published_at` text,
  `mailchimp_campaign_id` text,
  `mailchimp_created_at` text,
  `created_by` text NOT NULL,
  `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `newsletters_slug_unique` ON `newsletters` (`slug`);
--> statement-breakpoint
CREATE INDEX `newsletters_published_idx` ON `newsletters` (`published`,`published_at`);

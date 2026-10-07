ALTER TABLE `newsletters` ADD `mailchimp_sent_at` text;
--> statement-breakpoint
ALTER TABLE `newsletters` ADD `source_image_count` integer NOT NULL DEFAULT 0;

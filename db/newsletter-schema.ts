import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const newsletters = sqliteTable("newsletters", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull().default(""),
  sourceFilename: text("source_filename").notNull(),
  sourceFormat: text("source_format").notNull().default("docx"),
  contentHtml: text("content_html").notNull(),
  published: integer("published", { mode: "boolean" }).notNull().default(false),
  publishedAt: text("published_at"),
  mailchimpCampaignId: text("mailchimp_campaign_id"),
  mailchimpCreatedAt: text("mailchimp_created_at"),
  mailchimpSentAt: text("mailchimp_sent_at"),
  sourceImageCount: integer("source_image_count").notNull().default(0),
  createdBy: text("created_by").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("newsletters_slug_unique").on(table.slug),
  index("newsletters_published_idx").on(table.published, table.publishedAt),
]);

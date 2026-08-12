import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const subscribers = sqliteTable("subscribers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  firstName: text("first_name").notNull(),
  email: text("email").notNull(),
  source: text("source").notNull().default("/"),
  status: text("status").notNull().default("active"),
  providerStatus: text("provider_status").notNull().default("pending"),
  providerId: text("provider_id"),
  consentVersion: text("consent_version").notNull().default("2026-08-03"),
  consentAt: text("consent_at"),
  unsubscribeTokenHash: text("unsubscribe_token_hash"),
  unsubscribedAt: text("unsubscribed_at"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at"),
}, (table) => [
  uniqueIndex("subscribers_email_unique").on(table.email),
  uniqueIndex("subscribers_unsubscribe_token_unique").on(table.unsubscribeTokenHash),
]);


export const learningSeriesEnrollments = sqliteTable("learning_series_enrollments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull(),
  sequenceKey: text("sequence_key").notNull(),
  status: text("status").notNull().default("active"),
  nextStep: integer("next_step").notNull().default(1),
  startedAt: text("started_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  completedAt: text("completed_at"),
  updatedAt: text("updated_at"),
}, (table) => [
  uniqueIndex("learning_series_email_sequence_unique").on(table.email, table.sequenceKey),
  index("learning_series_status_idx").on(table.status, table.updatedAt),
]);

export const contactInquiries = sqliteTable("contact_inquiries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  topic: text("topic").notNull(),
  message: text("message").notNull(),
  deliveryStatus: text("delivery_status").notNull().default("pending"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("contact_inquiries_created_idx").on(table.createdAt)]);

export const emailOutbox = sqliteTable("email_outbox", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  kind: text("kind").notNull(),
  recipient: text("recipient").notNull(),
  payload: text("payload").notNull(),
  status: text("status").notNull().default("pending"),
  providerId: text("provider_id"),
  claimedAt: text("claimed_at"),
  updatedAt: text("updated_at"),
  attemptCount: integer("attempt_count").notNull().default(0),
  lastError: text("last_error"),
  nextAttemptAt: text("next_attempt_at"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  sentAt: text("sent_at"),
}, (table) => [
  index("email_outbox_status_idx").on(table.status),
  index("email_outbox_created_idx").on(table.createdAt),
  index("email_outbox_next_attempt_idx").on(table.status, table.nextAttemptAt),
]);

export const analyticsEvents = sqliteTable("analytics_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  eventName: text("event_name").notNull(),
  path: text("path").notNull(),
  label: text("label"),
  destination: text("destination"),
  sessionId: text("session_id"),
  referrer: text("referrer"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("analytics_events_name_idx").on(table.eventName), index("analytics_events_created_idx").on(table.createdAt)]);

export const commerceOrders = sqliteTable("commerce_orders", {
  id: text("id").primaryKey(),
  productKey: text("product_key").notNull(),
  provider: text("provider").notNull().default("stripe"),
  providerSessionId: text("provider_session_id"),
  providerPaymentIntentId: text("provider_payment_intent_id"),
  customerEmail: text("customer_email"),
  amountTotal: integer("amount_total"),
  currency: text("currency").notNull().default("usd"),
  source: text("source").notNull().default("unknown"),
  status: text("status").notNull().default("checkout_creating"),
  accessState: text("access_state").notNull().default("pending"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  paidAt: text("paid_at"),
  fulfilledAt: text("fulfilled_at"),
  refundedAt: text("refunded_at"),
}, (table) => [
  uniqueIndex("commerce_orders_provider_session_unique").on(table.providerSessionId),
  index("commerce_orders_email_idx").on(table.customerEmail),
  index("commerce_orders_status_idx").on(table.status),
  index("commerce_orders_created_idx").on(table.createdAt),
]);

export const commerceEvents = sqliteTable("commerce_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  provider: text("provider").notNull(),
  providerEventId: text("provider_event_id").notNull(),
  eventType: text("event_type").notNull(),
  orderId: text("order_id"),
  payloadHash: text("payload_hash").notNull(),
  status: text("status").notNull().default("received"),
  error: text("error"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  claimedAt: text("claimed_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  processedAt: text("processed_at"),
}, (table) => [
  uniqueIndex("commerce_events_provider_event_unique").on(table.provider, table.providerEventId),
  index("commerce_events_order_idx").on(table.orderId),
  index("commerce_events_created_idx").on(table.createdAt),
]);

export const commerceFulfillments = sqliteTable("commerce_fulfillments", {
  orderId: text("order_id").primaryKey(),
  email: text("email").notNull(),
  state: text("state").notNull().default("pending"),
  providerId: text("provider_id"),
  error: text("error"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  claimedAt: text("claimed_at"),
  updatedAt: text("updated_at"),
  attemptCount: integer("attempt_count").notNull().default(0),
  sentAt: text("sent_at"),
});

export const ebookDownloads = sqliteTable("ebook_downloads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: text("order_id").notNull(),
  channel: text("channel").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("ebook_downloads_order_idx").on(table.orderId), index("ebook_downloads_created_idx").on(table.createdAt)]);

export const recoveryRequests = sqliteTable("recovery_requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  emailHash: text("email_hash").notNull(),
  orderId: text("order_id"),
  status: text("status").notNull().default("received"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("recovery_requests_email_created_idx").on(table.emailHash, table.createdAt)]);

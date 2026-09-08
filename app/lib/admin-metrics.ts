import { and, desc, eq, sql } from "drizzle-orm";
import { getDb } from "../../db";
import { analyticsEvents, contactInquiries, subscribers } from "../../db/schema";

export type AdminDashboardMetrics = {
  available: boolean;
  pageViews30d: number;
  visitors30d: number;
  newsletterActive: number;
  newsletterNew30d: number;
  newsletterNeedsSync: number;
  contacts30d: number;
  checkoutStarts30d: number;
  topPages30d: Array<{ path: string; views: number }>;
};

const emptyMetrics: AdminDashboardMetrics = {
  available: false,
  pageViews30d: 0,
  visitors30d: 0,
  newsletterActive: 0,
  newsletterNew30d: 0,
  newsletterNeedsSync: 0,
  contacts30d: 0,
  checkoutStarts30d: 0,
  topPages30d: [],
};

function numberValue(value: unknown) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function getAdminDashboardMetrics(): Promise<AdminDashboardMetrics> {
  try {
    const db = await getDb();
    const last30Days = sql`${analyticsEvents.createdAt} >= datetime('now', '-30 days')`;
    const subscriberLast30Days = sql`${subscribers.createdAt} >= datetime('now', '-30 days')`;
    const contactLast30Days = sql`${contactInquiries.createdAt} >= datetime('now', '-30 days')`;
    const pageCount = sql<number>`count(*)`;

    const [
      trafficRows,
      activeRows,
      newSubscriberRows,
      syncRows,
      contactRows,
      checkoutRows,
      topPages,
    ] = await Promise.all([
      db.select({
        pageViews: sql<number>`count(*)`,
        visitors: sql<number>`count(distinct ${analyticsEvents.sessionId})`,
      }).from(analyticsEvents).where(and(eq(analyticsEvents.eventName, "page_view"), last30Days)),
      db.select({ total: sql<number>`count(*)` }).from(subscribers).where(eq(subscribers.status, "active")),
      db.select({ total: sql<number>`count(*)` }).from(subscribers).where(subscriberLast30Days),
      db.select({ total: sql<number>`count(*)` }).from(subscribers).where(and(
        eq(subscribers.status, "active"),
        sql`${subscribers.providerStatus} <> 'synced'`,
      )),
      db.select({ total: sql<number>`count(*)` }).from(contactInquiries).where(contactLast30Days),
      db.select({ total: sql<number>`count(*)` }).from(analyticsEvents).where(and(eq(analyticsEvents.eventName, "begin_checkout"), last30Days)),
      db.select({ path: analyticsEvents.path, views: pageCount })
        .from(analyticsEvents)
        .where(and(eq(analyticsEvents.eventName, "page_view"), last30Days))
        .groupBy(analyticsEvents.path)
        .orderBy(desc(pageCount))
        .limit(5),
    ]);

    const traffic = trafficRows[0];
    return {
      available: true,
      pageViews30d: numberValue(traffic?.pageViews),
      visitors30d: numberValue(traffic?.visitors),
      newsletterActive: numberValue(activeRows[0]?.total),
      newsletterNew30d: numberValue(newSubscriberRows[0]?.total),
      newsletterNeedsSync: numberValue(syncRows[0]?.total),
      contacts30d: numberValue(contactRows[0]?.total),
      checkoutStarts30d: numberValue(checkoutRows[0]?.total),
      topPages30d: topPages.map((row) => ({ path: row.path, views: numberValue(row.views) })),
    };
  } catch (error) {
    console.error("admin_dashboard_metrics_failed", error);
    return emptyMetrics;
  }
}

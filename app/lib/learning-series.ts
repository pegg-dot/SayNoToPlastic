import { and, eq, inArray } from "drizzle-orm";
import { getDb } from "../../db";
import { emailOutbox, learningSeriesEnrollments } from "../../db/schema";
import { learningSeries, learningSeriesKey } from "../content/community-programs";

function sqliteTimestamp(date = new Date()) {
  return date.toISOString().replace("T", " ").replace(/\.\d{3}Z$/, "");
}

export async function enrollInLearningSeries(input: {
  email: string;
  firstName: string;
  unsubscribeToken: string;
  siteOrigin: string;
}) {
  const db = await getDb();
  const nowDate = new Date();
  const now = sqliteTimestamp(nowDate);
  const [existing] = await db.select().from(learningSeriesEnrollments).where(and(
    eq(learningSeriesEnrollments.email, input.email),
    eq(learningSeriesEnrollments.sequenceKey, learningSeriesKey),
  )).limit(1);

  if (existing) {
    await db.update(emailOutbox).set({ status: "dead", updatedAt: now, lastError: "learning_series_restarted", nextAttemptAt: null }).where(and(
      eq(emailOutbox.kind, "learning_series"),
      eq(emailOutbox.recipient, input.email),
      inArray(emailOutbox.status, ["pending", "queued", "failed"]),
    ));
    await db.update(learningSeriesEnrollments).set({
      status: "active",
      nextStep: 1,
      startedAt: now,
      completedAt: null,
      updatedAt: now,
    }).where(eq(learningSeriesEnrollments.id, existing.id));
  } else {
    const [inserted] = await db.insert(learningSeriesEnrollments).values({
      email: input.email,
      sequenceKey: learningSeriesKey,
      status: "active",
      nextStep: 1,
      startedAt: now,
      updatedAt: now,
    }).onConflictDoNothing({ target: [learningSeriesEnrollments.email, learningSeriesEnrollments.sequenceKey] }).returning({ id: learningSeriesEnrollments.id });
    if (!inserted) {
      // A concurrent request won the unique enrollment insert. Re-enter through
      // the update path so only one fresh schedule remains.
      return enrollInLearningSeries(input);
    }
  }

  const jobs = learningSeries.map((item) => ({
    kind: "learning_series",
    recipient: input.email,
    status: "pending",
    payload: JSON.stringify({
      firstName: input.firstName,
      sequenceKey: learningSeriesKey,
      step: item.step,
      unsubscribeToken: input.unsubscribeToken,
      siteOrigin: input.siteOrigin,
    }),
    nextAttemptAt: sqliteTimestamp(new Date(nowDate.getTime() + item.dayOffset * 24 * 60 * 60 * 1000)),
    updatedAt: now,
  }));
  await db.insert(emailOutbox).values(jobs);
  return { enrolled: true, status: existing ? "restarted" as const : "scheduled" as const, scheduled: jobs.length };
}

export async function markLearningSeriesStep(input: { email: string; sequenceKey: string; step: number; finalStep: number }) {
  const db = await getDb();
  const completed = input.step >= input.finalStep;
  const now = sqliteTimestamp();
  await db.update(learningSeriesEnrollments).set({
    status: completed ? "completed" : "active",
    nextStep: completed ? input.finalStep + 1 : input.step + 1,
    completedAt: completed ? now : null,
    updatedAt: now,
  }).where(and(
    eq(learningSeriesEnrollments.email, input.email),
    eq(learningSeriesEnrollments.sequenceKey, input.sequenceKey),
  ));
}

export async function cancelLearningSeries(email: string) {
  const db = await getDb();
  const now = sqliteTimestamp();
  await db.update(learningSeriesEnrollments).set({ status: "cancelled", updatedAt: now }).where(and(
    eq(learningSeriesEnrollments.email, email),
    eq(learningSeriesEnrollments.sequenceKey, learningSeriesKey),
  ));
  await db.update(emailOutbox).set({ status: "dead", updatedAt: now, lastError: "subscriber_unsubscribed", nextAttemptAt: null }).where(and(
    eq(emailOutbox.kind, "learning_series"),
    eq(emailOutbox.recipient, email),
    inArray(emailOutbox.status, ["pending", "queued", "failed"]),
  ));
}


export async function failLearningSeries(input: { email: string; sequenceKey: string; reason: string }) {
  const db = await getDb();
  const now = sqliteTimestamp();
  await db.update(learningSeriesEnrollments).set({
    status: "delivery_failed",
    updatedAt: now,
  }).where(and(
    eq(learningSeriesEnrollments.email, input.email),
    eq(learningSeriesEnrollments.sequenceKey, input.sequenceKey),
  ));
  await db.update(emailOutbox).set({
    status: "dead",
    updatedAt: now,
    lastError: input.reason.slice(0, 240),
    nextAttemptAt: null,
  }).where(and(
    eq(emailOutbox.kind, "learning_series"),
    eq(emailOutbox.recipient, input.email),
    inArray(emailOutbox.status, ["pending", "queued", "failed"]),
  ));
}

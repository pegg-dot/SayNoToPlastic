#!/usr/bin/env node
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  learningSeries,
  learningSeriesKey,
  sevenDayChallenge,
  thirtyDayChallenge,
} from "../app/content/community-programs.ts";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const source = (path) => readFileSync(join(root, path), "utf8");

assert.match(learningSeriesKey, /^[a-z0-9-]+-v\d+$/);
assert.equal(learningSeries.length, 10);
assert.deepEqual(learningSeries.map((item) => item.step), Array.from({ length: 10 }, (_, index) => index + 1));
assert.deepEqual(learningSeries.map((item) => item.number), Array.from({ length: 10 }, (_, index) => String(index + 1).padStart(2, "0")));
assert.equal(new Set(learningSeries.map((item) => item.step)).size, learningSeries.length);
assert.equal(new Set(learningSeries.map((item) => item.emailSubject)).size, learningSeries.length);
assert.equal(new Set(learningSeries.map((item) => item.href)).size, learningSeries.length);
assert.ok(learningSeries.every((item) => item.dayOffset >= 1 && item.dayOffset <= 30));
assert.ok(learningSeries.every((item, index) => index === 0 || item.dayOffset > learningSeries[index - 1].dayOffset));
assert.ok(learningSeries.every((item) => item.emailLead.length > 80 && item.carryForward.length > 70));

assert.equal(sevenDayChallenge.length, 7);
assert.deepEqual(sevenDayChallenge.map((task) => task.day), Array.from({ length: 7 }, (_, index) => index + 1));
assert.equal(thirtyDayChallenge.length, 30);
assert.deepEqual(thirtyDayChallenge.map((task) => task.day), Array.from({ length: 30 }, (_, index) => index + 1));
assert.ok([...sevenDayChallenge, ...thirtyDayChallenge].every((task) => task.title.trim() && task.text.length > 30));

const migration = source("drizzle/0006_learning_series.sql");
const enrollment = source("app/lib/learning-series.ts");
const outbox = source("app/lib/email-outbox.ts");
const subscribe = source("app/api/subscribe/route.ts");
const unsubscribe = source("app/api/subscription/unsubscribe/route.ts");

for (const token of ["learning_series_enrollments", "sequence_key", "next_step", "learning_series_email_sequence_unique"]) {
  assert.ok(migration.includes(token), `migration missing ${token}`);
}
assert.ok(enrollment.includes('lastError: "learning_series_restarted"'));
assert.ok(enrollment.includes('status: existing ? "restarted"'));
assert.ok(!enrollment.includes('existing?.status === "active"'), "explicit re-enrollment must refresh the schedule and unsubscribe token");
assert.ok(outbox.includes('job.kind === "learning_series"'));
assert.ok(outbox.includes("markLearningSeriesStep"));
assert.ok(outbox.includes("learning_series_waiting_for_prior_step"));
assert.ok(outbox.includes("payload.step > enrollment.nextStep"));
assert.ok(outbox.includes("learning_series_paused_after_terminal_failure"));
assert.ok(outbox.includes("learning_series_paused_provider_not_configured"));
assert.ok(outbox.includes("failLearningSeries"));
assert.ok(outbox.indexOf("await markLearningSeriesStep") < outbox.indexOf("await markSent(job.id, result.id)", outbox.indexOf('job.kind === "learning_series"')), "series advancement must precede payload scrubbing after provider success");
assert.ok(subscribe.includes('program === "learning-series"'));
assert.ok(subscribe.includes("welcome_replaced_after_token_rotation"));
assert.ok(unsubscribe.includes("cancelLearningSeries"));

console.log("[PASS] Learning-series registry, challenge plans, scheduling, restart, and unsubscribe contracts are coherent.");

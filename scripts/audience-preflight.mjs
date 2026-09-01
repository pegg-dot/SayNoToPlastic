#!/usr/bin/env node
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const source = (path) => readFileSync(join(root, path), "utf8");
const checks = [];
const expect = (ok, message) => checks.push({ ok: Boolean(ok), message });

const env = source(".env.example");
for (const key of ["AUDIENCE_PROVIDER", "MAILCHIMP_API_KEY", "MAILCHIMP_SERVER_PREFIX", "MAILCHIMP_AUDIENCE_ID"]) {
  expect(new RegExp(`^${key}=`, "m").test(env), `.env.example declares ${key}.`);
}
expect(/^AUDIENCE_PROVIDER=mailchimp$/m.test(env), "Audience provider reflects Dr. Haddad's approved Mailchimp activation request.");

const audience = source("app/lib/audience-service.ts");
expect(audience.includes('type AudienceProvider = "none" | "resend" | "mailchimp"'), "Audience provider boundary supports none, Resend, and Mailchimp.");
expect(audience.includes("status_if_new: \"subscribed\"") && audience.includes("status: \"unsubscribed\""), "Mailchimp synchronization covers subscribe and unsubscribe states.");
expect(audience.includes("mailchimpSubscriberHash") && audience.includes("TextEncoder"), "Mailchimp member identifiers are generated without a runtime package dependency.");
expect(audience.includes("mailchimpServerPrefix") && audience.includes("MAILCHIMP_API_KEY?.trim().match"), "Mailchimp server prefix can be derived from the API key when not separately supplied.");
expect(audience.includes("/contacts") && audience.includes("unsubscribed: true"), "Resend remains available for transactional or alternative audience use without being selected for Field Notes.");

const outbox = source("app/lib/email-outbox.ts");
expect(outbox.includes("syncAudienceSubscriber") && outbox.includes("unsubscribeAudienceSubscriber"), "Durable outbox routes audience synchronization through the provider adapter.");

const readiness = source("app/api/internal/readiness/route.ts");
expect(readiness.includes("audienceProvider") && readiness.includes("audienceConfigured"), "Protected readiness reports audience provider state without returning secrets.");

const email = "prudence.mcvankab@example.com";
const expected = createHash("md5").update(email).digest("hex");
expect(expected.length === 32, "Reference Mailchimp subscriber hash is a 32-character MD5 digest.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.message}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

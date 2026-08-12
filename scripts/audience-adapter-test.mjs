#!/usr/bin/env node
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  mailchimpSubscriberHash,
  resolveAudienceProvider,
  syncAudienceSubscriber,
  unsubscribeAudienceSubscriber,
} from "../app/lib/audience-service.ts";

assert.equal(resolveAudienceProvider(undefined), "none");
assert.equal(resolveAudienceProvider("MAILCHIMP"), "mailchimp");
assert.equal(resolveAudienceProvider("resend"), "resend");
for (const email of ["prudence.mcvankab@example.com", "TEST@example.com", "another+tag@example.org"]) {
  assert.equal(mailchimpSubscriberHash(email), createHash("md5").update(email.trim().toLowerCase()).digest("hex"));
}

const requests = [];
globalThis.fetch = async (url, init = {}) => {
  requests.push({ url: String(url), method: init.method, headers: init.headers, body: JSON.parse(String(init.body || "{}")) });
  return new Response(JSON.stringify({ id: "provider-id" }), { status: 200, headers: { "content-type": "application/json" } });
};

process.env.AUDIENCE_PROVIDER = "mailchimp";
process.env.MAILCHIMP_API_KEY = "test-key-us21";
process.env.MAILCHIMP_SERVER_PREFIX = "us21";
process.env.MAILCHIMP_AUDIENCE_ID = "audience-123";
let result = await syncAudienceSubscriber({ email: "Reader@Example.com", firstName: "Reader", source: "/community" });
assert.equal(result.configured, true);
assert.equal(result.provider, "mailchimp");
assert.match(requests[0].url, /us21\.api\.mailchimp\.com\/3\.0\/lists\/audience-123\/members\/[a-f0-9]{32}$/);
assert.equal(requests[0].method, "PUT");
assert.deepEqual(requests[0].body.merge_fields, { FNAME: "Reader" });
assert.equal(requests[0].body.status_if_new, "subscribed");

result = await unsubscribeAudienceSubscriber("Reader@Example.com");
assert.equal(result.configured, true);
assert.equal(requests[1].method, "PATCH");
assert.equal(requests[1].body.status, "unsubscribed");

requests.length = 0;
process.env.AUDIENCE_PROVIDER = "resend";
process.env.RESEND_API_KEY = "re_test";
result = await syncAudienceSubscriber({ email: "reader@example.com", firstName: "Reader", source: "/" });
assert.equal(result.provider, "resend");
assert.equal(requests[0].url, "https://api.resend.com/contacts");
assert.equal(requests[0].body.unsubscribed, false);

requests.length = 0;
process.env.AUDIENCE_PROVIDER = "none";
result = await syncAudienceSubscriber({ email: "reader@example.com", firstName: "Reader", source: "/" });
assert.equal(result.configured, false);
assert.equal(requests.length, 0);

console.log("[PASS] Audience provider adapter contract passed for none, Resend, and Mailchimp.");

#!/usr/bin/env node
import assert from "node:assert/strict";
import { sendNewsletterCampaign } from "../app/lib/newsletter-mailchimp.ts";

process.env.MAILCHIMP_API_KEY = "test-key-us21";
process.env.MAILCHIMP_SERVER_PREFIX = "us21";
process.env.MAILCHIMP_AUDIENCE_ID = "audience-123";

const requests = [];
globalThis.fetch = async (url, init = {}) => {
  const value = String(url);
  requests.push({ url: value, method: init.method || "GET" });

  if (value.includes("?fields=status,send_time")) {
    return new Response(JSON.stringify({ status: "save" }), { status: 200, headers: { "content-type": "application/json" } });
  }
  if (value.endsWith("/send-checklist")) {
    return new Response(JSON.stringify({ is_ready: true, items: [] }), { status: 200, headers: { "content-type": "application/json" } });
  }
  if (value.endsWith("/actions/send")) return new Response(null, { status: 204 });
  throw new Error(`Unexpected request: ${value}`);
};

let result = await sendNewsletterCampaign("campaign-123");
assert.equal(result.sent, true);
assert.equal(result.alreadySent, false);
assert.deepEqual(requests.map((request) => request.method), ["GET", "GET", "POST"]);
assert.match(requests[2].url, /campaigns\/campaign-123\/actions\/send$/);

requests.length = 0;
globalThis.fetch = async (url, init = {}) => {
  requests.push({ url: String(url), method: init.method || "GET" });
  return new Response(JSON.stringify({ status: "sent", send_time: "2026-10-06T20:00:00Z" }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
};
result = await sendNewsletterCampaign("campaign-sent");
assert.equal(result.alreadySent, true);
assert.equal(result.sentAt, "2026-10-06T20:00:00Z");
assert.equal(requests.length, 1);

requests.length = 0;
globalThis.fetch = async (url, init = {}) => {
  const value = String(url);
  requests.push({ url: value, method: init.method || "GET" });
  if (value.includes("?fields=status,send_time")) {
    return new Response(JSON.stringify({ status: "save" }), { status: 200, headers: { "content-type": "application/json" } });
  }
  return new Response(JSON.stringify({
    is_ready: false,
    items: [{ type: "error", heading: "Audience required" }],
  }), { status: 200, headers: { "content-type": "application/json" } });
};
await assert.rejects(() => sendNewsletterCampaign("campaign-blocked"), /not ready to send.*Audience required/);
assert.equal(requests.some((request) => request.url.endsWith("/actions/send")), false);

console.log("[PASS] Newsletter Mailchimp send contract: readiness check, immediate send, and already-sent idempotency.");

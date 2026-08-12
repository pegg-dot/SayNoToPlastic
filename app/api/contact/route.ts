import { getDb } from "../../../db";
import { contactInquiries, emailOutbox } from "../../../db/schema";
import { SUPPORT_EMAIL } from "../../config";
import { deliverEmailOutboxJob } from "../../lib/email-outbox";
import { bodyIsReasonable, isSameOrigin, readJsonBody } from "../../lib/request-safety";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOPICS = new Set(["Media and speaking", "Research and science", "Book and orders", "Partnership", "General inquiry"]);

async function configuredSupportEmail() {
  try {
    const { env } = await import("cloudflare:workers");
    const value = typeof env.SUPPORT_EMAIL === "string" ? env.SUPPORT_EMAIL.trim() : "";
    return value || SUPPORT_EMAIL;
  } catch {
    return process.env.SUPPORT_EMAIL?.trim() || SUPPORT_EMAIL;
  }
}

export async function POST(request: Request) {
  try {
    if (!isSameOrigin(request) || !bodyIsReasonable(request)) return Response.json({ error: "Request rejected." }, { status: 400 });
    const payload = await readJsonBody<Record<string, unknown>>(request);
    if (typeof payload.website === "string" && payload.website.trim()) return Response.json({ ok: true }, { status: 201 });
    const name = typeof payload.name === "string" ? payload.name.trim().slice(0, 120) : "";
    const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase().slice(0, 254) : "";
    const rawTopic = typeof payload.topic === "string" ? payload.topic.trim().slice(0, 80) : "General inquiry";
    const topic = TOPICS.has(rawTopic) ? rawTopic : "General inquiry";
    const message = typeof payload.message === "string" ? payload.message.trim().slice(0, 5000) : "";
    if (!name || !EMAIL.test(email) || message.length < 10) return Response.json({ error: "Please complete your name, email, and message." }, { status: 400 });

    const db = await getDb();
    const now = new Date().toISOString();
    const [inquiry] = await db.insert(contactInquiries).values({ name, email, topic, message }).returning({ id: contactInquiries.id });
    const [job] = await db.insert(emailOutbox).values({
      kind: "contact_notification",
      recipient: await configuredSupportEmail(),
      status: "pending",
      payload: JSON.stringify({ inquiryId: inquiry?.id || null, name, email, topic, message }),
      updatedAt: now,
    }).returning({ id: emailOutbox.id });
    const delivery = job?.id ? await deliverEmailOutboxJob(job.id) : "queued";
    return Response.json({ ok: true, delivery: delivery === "sent" ? "sent" : "queued" }, { status: 201 });
  } catch (error) {
    console.error("contact_failed", error);
    return Response.json({ error: "We could not record your inquiry. Please try again shortly." }, { status: 500 });
  }
}

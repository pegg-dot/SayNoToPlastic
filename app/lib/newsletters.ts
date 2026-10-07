import { and, desc, eq } from "drizzle-orm";
import { unzipSync, strFromU8 } from "fflate";
import { getDb } from "../../db";
import { newsletters } from "../../db/newsletter-schema";

export type NewsletterRecord = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  sourceFilename: string;
  contentHtml: string;
  published: boolean;
  publishedAt: string | null;
  mailchimpCampaignId: string | null;
  mailchimpCreatedAt: string | null;
  mailchimpSentAt: string | null;
  sourceImageCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

const MAX_DOCX_BYTES = 4_000_000;
const MAX_HTML_BYTES = 220_000;

function decodeXml(value: string) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function safeHref(value: string | undefined) {
  if (!value) return "";
  try {
    const url = new URL(decodeXml(value));
    if (url.protocol === "https:" || url.protocol === "http:" || url.protocol === "mailto:") return escapeHtml(url.toString());
  } catch {}
  return "";
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
  return slug || "field-note";
}

function titleFromFilename(filename: string) {
  return filename
    .replace(/\.docx$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim() || "Field Note";
}

function relationshipMap(xml: string) {
  const map = new Map<string, string>();
  const re = /<Relationship\b([^>]+?)\/?\s*>/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(xml))) {
    const attrs = match[1];
    const id = attrs.match(/\bId="([^"]+)"/)?.[1];
    const target = attrs.match(/\bTarget="([^"]+)"/)?.[1];
    const mode = attrs.match(/\bTargetMode="([^"]+)"/)?.[1];
    if (id && target && mode === "External") map.set(id, target);
  }
  return map;
}

function paragraphStyle(xml: string) {
  return xml.match(/<w:pStyle\b[^>]*w:val="([^"]+)"/)?.[1]?.toLowerCase() || "";
}

function paragraphHtml(xml: string, rels: Map<string, string>) {
  const style = paragraphStyle(xml);
  const listLike = /<w:numPr\b/.test(xml);
  const tokens: string[] = [];
  const tokenRe = /<w:hyperlink\b[^>]*r:id="([^"]+)"[^>]*>([\s\S]*?)<\/w:hyperlink>|<w:r\b[^>]*>([\s\S]*?)<\/w:r>/g;
  let match: RegExpExecArray | null;

  while ((match = tokenRe.exec(xml))) {
    const hyperlinkId = match[1];
    const runXml = match[2] || match[3] || "";
    const text = Array.from(runXml.matchAll(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g))
      .map((item) => decodeXml(item[1]))
      .join("");
    if (!text) continue;
    let rendered = escapeHtml(text);
    if (/<w:b\b/.test(runXml)) rendered = `<strong>${rendered}</strong>`;
    if (/<w:i\b/.test(runXml)) rendered = `<em>${rendered}</em>`;
    if (hyperlinkId) {
      const href = safeHref(rels.get(hyperlinkId));
      if (href) rendered = `<a href="${href}" target="_blank" rel="noreferrer">${rendered}</a>`;
    }
    tokens.push(rendered);
  }

  const content = tokens.join("").trim();
  if (!content) return "";
  if (style.includes("title") || style.includes("heading1")) return `<h2>${content}</h2>`;
  if (style.includes("heading2")) return `<h3>${content}</h3>`;
  if (style.includes("heading3")) return `<h4>${content}</h4>`;
  if (style.includes("quote")) return `<blockquote>${content}</blockquote>`;
  if (listLike) return `<li>${content}</li>`;
  return `<p>${content}</p>`;
}

export function parseDocxNewsletter(input: Uint8Array, filename: string) {
  if (input.byteLength === 0 || input.byteLength > MAX_DOCX_BYTES) {
    throw new Error("Use a Word .docx file smaller than 4 MB.");
  }

  let archive: Record<string, Uint8Array>;
  try {
    archive = unzipSync(input);
  } catch {
    throw new Error("That file could not be read as a Word .docx document.");
  }

  const documentFile = archive["word/document.xml"];
  if (!documentFile) throw new Error("That Word document does not contain readable document text.");
  const documentXml = strFromU8(documentFile);
  const relsFile = archive["word/_rels/document.xml.rels"];
  const rels = relsFile ? relationshipMap(strFromU8(relsFile)) : new Map<string, string>();

  const paragraphs = Array.from(documentXml.matchAll(/<w:p\b[\s\S]*?<\/w:p>/g)).map((match) => match[0]);
  const blocks = paragraphs.map((paragraph) => paragraphHtml(paragraph, rels)).filter(Boolean);

  if (!blocks.length) throw new Error("No readable newsletter text was found in that Word document.");

  const firstHeading = blocks.find((block) => /^<h[234]>/.test(block));
  const headingText = firstHeading?.replace(/<[^>]+>/g, "").trim();
  const title = decodeXml(headingText || titleFromFilename(filename)).slice(0, 180);
  const contentBlocks = firstHeading && headingText && decodeXml(headingText) === title ? blocks.filter((block) => block !== firstHeading) : blocks;
  const contentHtml = contentBlocks.join("\n").replace(/(?:<li>[\s\S]*?<\/li>\n?)+/g, (group) => `<ul>${group}</ul>`);

  if (new TextEncoder().encode(contentHtml).byteLength > MAX_HTML_BYTES) {
    throw new Error("This newsletter is too large after import. Please use a shorter Word document.");
  }

  const plain = contentHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const excerpt = plain.slice(0, 220) + (plain.length > 220 ? "…" : "");
  const imageCount = Object.keys(archive).filter((path) => path.startsWith("word/media/")).length;

  return { title, excerpt, contentHtml, imageCount };
}

export async function listNewslettersForAdmin() {
  const db = await getDb();
  return db.select().from(newsletters).orderBy(desc(newsletters.createdAt)).limit(100);
}

export async function listPublishedNewsletters() {
  const db = await getDb();
  return db.select().from(newsletters)
    .where(eq(newsletters.published, true))
    .orderBy(desc(newsletters.publishedAt), desc(newsletters.createdAt))
    .limit(100);
}

export async function getPublishedNewsletter(slug: string) {
  const db = await getDb();
  const rows = await db.select().from(newsletters)
    .where(and(eq(newsletters.slug, slug), eq(newsletters.published, true)))
    .limit(1);
  return rows[0] || null;
}

export async function getNewsletterById(id: number) {
  const db = await getDb();
  const rows = await db.select().from(newsletters).where(eq(newsletters.id, id)).limit(1);
  return rows[0] || null;
}

export async function createNewsletterFromDocx(input: {
  filename: string;
  bytes: Uint8Array;
  createdBy: string;
}) {
  const parsed = parseDocxNewsletter(input.bytes, input.filename);
  const db = await getDb();
  const base = slugify(parsed.title);
  let slug = base;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const existing = await db.select({ id: newsletters.id }).from(newsletters).where(eq(newsletters.slug, slug)).limit(1);
    if (!existing.length) break;
    slug = `${base}-${attempt + 2}`;
  }
  const now = new Date().toISOString();
  const inserted = await db.insert(newsletters).values({
    slug,
    title: parsed.title,
    excerpt: parsed.excerpt,
    sourceFilename: input.filename,
    sourceFormat: "docx",
    contentHtml: parsed.contentHtml,
    published: false,
    publishedAt: null,
    sourceImageCount: parsed.imageCount,
    createdBy: input.createdBy,
    createdAt: now,
    updatedAt: now,
  }).returning();
  return { newsletter: inserted[0], imageCount: parsed.imageCount };
}

export async function updateNewsletter(input: {
  id: number;
  title?: string;
  excerpt?: string;
  published?: boolean;
}) {
  const db = await getDb();
  const rows = await db.select().from(newsletters).where(eq(newsletters.id, input.id)).limit(1);
  const current = rows[0];
  if (!current) throw new Error("Newsletter not found.");

  const patch: Partial<typeof newsletters.$inferInsert> = { updatedAt: new Date().toISOString() };
  if (typeof input.title === "string") {
    const title = input.title.trim().slice(0, 180);
    if (!title) throw new Error("Newsletter title is required.");
    patch.title = title;
  }
  if (typeof input.excerpt === "string") patch.excerpt = input.excerpt.trim().slice(0, 320);
  if (typeof input.published === "boolean") {
    if (!input.published && current.mailchimpSentAt) {
      throw new Error("This issue was already emailed. Keep it published so links in the sent email continue to work.");
    }
    patch.published = input.published;
    patch.publishedAt = input.published ? (current.publishedAt || new Date().toISOString()) : null;
  }

  const updated = await db.update(newsletters).set(patch).where(eq(newsletters.id, input.id)).returning();
  return updated[0];
}

export async function deleteNewsletter(id: number) {
  const db = await getDb();
  const rows = await db.select().from(newsletters).where(eq(newsletters.id, id)).limit(1);
  const current = rows[0];
  if (!current) throw new Error("Newsletter not found.");
  if (current.mailchimpSentAt) {
    throw new Error("This issue was already emailed. Keep it in the website archive so links in the sent email continue to work.");
  }

  await db.delete(newsletters).where(eq(newsletters.id, id));
  return {
    id,
    wasPublished: Boolean(current.published),
    mailchimpDraftPreserved: Boolean(current.mailchimpCampaignId),
  };
}

export async function markNewsletterMailchimpDraft(id: number, campaignId: string) {
  const db = await getDb();
  const now = new Date().toISOString();
  const updated = await db.update(newsletters).set({
    mailchimpCampaignId: campaignId,
    mailchimpCreatedAt: now,
    updatedAt: now,
  }).where(eq(newsletters.id, id)).returning();
  return updated[0];
}

export async function markNewsletterMailchimpSent(id: number, sentAt?: string | null) {
  const db = await getDb();
  const now = new Date().toISOString();
  const updated = await db.update(newsletters).set({
    mailchimpSentAt: sentAt || now,
    updatedAt: now,
  }).where(eq(newsletters.id, id)).returning();
  return updated[0];
}

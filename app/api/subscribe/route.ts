export const dynamic = "force-dynamic";

export async function POST() {
  return Response.json(
    {
      ok: false,
      code: "newsletter_coming_soon",
      message: "Field Notes / Newsletter is coming soon. No email addresses are collected at launch.",
    },
    {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}

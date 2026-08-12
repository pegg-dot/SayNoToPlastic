import { BUILD_VERSION } from "../../build-version";

export function GET() {
  return Response.json({ ok: true, service: "say-no-to-plastic", version: BUILD_VERSION }, {
    headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
  });
}

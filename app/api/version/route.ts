import { BUILD_VERSION } from "../../build-version";

export async function GET() {
  return Response.json(
    { version: BUILD_VERSION },
    { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" } },
  );
}

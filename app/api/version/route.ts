import { BUILD_VERSION } from "../../build-version";
import { DEPLOY_REVISION } from "../../deploy-revision.generated";

export async function GET() {
  return Response.json(
    { version: BUILD_VERSION, revision: DEPLOY_REVISION },
    { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" } },
  );
}

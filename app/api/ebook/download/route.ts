import { downloadEbook } from "../../../lib/commerce";
import { isSameOrigin, readBodyText } from "../../../lib/request-safety";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return new Response("Request rejected.", { status: 400 });
  try {
    const form = new URLSearchParams(await readBodyText(request, 8_000));
    return downloadEbook(form.get("token"));
  } catch {
    return new Response("Request rejected.", { status: 400 });
  }
}

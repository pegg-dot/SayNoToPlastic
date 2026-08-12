import { handleStripeWebhook } from "../../../lib/commerce";

export async function POST(request: Request) {
  return handleStripeWebhook(request);
}

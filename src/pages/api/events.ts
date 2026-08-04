import type { APIRoute } from "astro";
import { Webhook } from "svix";
import { isEmailReceivedEvent, type ResendWebhookEventI } from "src/types/webhook";

const WEBHOOK_SECRET = import.meta.env.RESEND_WEBHOOK_SECRET;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ request }) => {
  if (!WEBHOOK_SECRET) {
    return json({ success: false, message: "Webhook secret not configured" }, 500);
  }

  const svixHeaders = {
    "svix-id": request.headers.get("svix-id") ?? "",
    "svix-timestamp": request.headers.get("svix-timestamp") ?? "",
    "svix-signature": request.headers.get("svix-signature") ?? "",
  };

  // Signature is computed over the raw body — parse only after verifying.
  const payload = await request.text();

  let event: ResendWebhookEventI;
  try {
    event = new Webhook(WEBHOOK_SECRET).verify(payload, svixHeaders) as ResendWebhookEventI;
  } catch {
    return json({ success: false, message: "Invalid signature" }, 401);
  }

  if (isEmailReceivedEvent(event)) {
    const { email_id, from, to, subject } = event.data;
    console.log(`[resend] email.received ${email_id} from ${from} to ${to.join(", ")}: ${subject}`);

    return json({ success: true, email_id });
  }

  return json({ success: true });
};

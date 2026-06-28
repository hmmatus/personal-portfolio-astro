import { Resend } from "resend";
import type { APIRoute } from "astro";
import type { EmailProps } from "src/types/email";

const resend = new Resend(import.meta.env.RESEND_TOKEN);
const FROM_EMAIL = import.meta.env.RESEND_FROM_EMAIL;

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const { to, subject, message } = body as EmailProps;

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: [to],
    subject: `Portfolio - ${subject}`,
    html: `<p>${message}</p>`,
    text: message,
  });

  if (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

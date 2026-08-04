import { Resend } from "resend";
import type { APIRoute } from "astro";
import type { EmailProps } from "src/types/email";

const resend = new Resend(import.meta.env.RESEND_TOKEN);
const FROM_EMAIL = import.meta.env.RESEND_FROM_EMAIL;
const TO_EMAIL = import.meta.env.RESEND_TO_EMAIL;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const { name, email, subject, message } = body as EmailProps;

  const text = `From: ${name} <${email}>\n\n${message}`;

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    // Always the inbox owner — never a client-supplied address.
    to: [TO_EMAIL],
    replyTo: email,
    subject: `Portfolio - ${subject}`,
    html: `<p><strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt;</p><p>${escapeHtml(message)}</p>`,
    text,
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

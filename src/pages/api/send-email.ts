import sendgrid, {
  type ResponseError,
  type MailDataRequired,
} from "@sendgrid/mail";
import type { APIRoute } from "astro";
import type { EmailProps } from "src/types/email";
const { PUBLIC_SENDGRID_API_KEY } = import.meta.env;
sendgrid.setApiKey(PUBLIC_SENDGRID_API_KEY);
export const POST: APIRoute = async ({ params, request }) => {
  const body = await request.json();
  const { from, to, subject, message } = body as EmailProps;
  const options: MailDataRequired = {
    from,
    to,
    subject: `Portfolio - ${subject}`,
    html: `<p>${message}</p>`,
    content: [{ type: "text/plain", value: message }],
  };
  try {
    await sendgrid.send(options);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    const { message } = error as ResponseError;
    return new Response(JSON.stringify({ success: false, message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

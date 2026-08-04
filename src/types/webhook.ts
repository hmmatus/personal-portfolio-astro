export interface ReceivedAttachmentI {
  id: string;
  filename: string;
  content_type: string;
  content_disposition: string;
  content_id?: string;
}

export interface EmailReceivedDataI {
  email_id: string;
  created_at: string;
  message_id: string;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  /** Recipients taken from the `for` clause of the message's `Received` headers. */
  received_for?: string[];
  broadcast_id?: string;
  template_id?: string;
  tags?: Record<string, string>;
  /** Metadata only — fetch contents via the Attachments API. */
  attachments?: ReceivedAttachmentI[];
}

export interface EmailReceivedEventI {
  type: "email.received";
  created_at: string;
  data: EmailReceivedDataI;
}

export interface ResendWebhookEventI {
  type: string;
  created_at: string;
  data: unknown;
}

export const isEmailReceivedEvent = (
  event: ResendWebhookEventI,
): event is EmailReceivedEventI => event.type === "email.received";

import type { Config } from '@netlify/functions';
import { Resend, type EmailReceivedEvent } from 'resend';

const FALLBACK_SUPABASE_URL = 'https://iupspzfbhxfikxjleizd.supabase.co';

function json(body: unknown, status: number) {
  return Response.json(body, { status });
}

function requiredHeader(req: Request, name: string): string {
  return req.headers.get(name)?.trim() ?? '';
}

function splitSender(sender: string) {
  const match = sender.match(/^\s*(.*?)\s*<([^<>]+)>\s*$/);
  return match
    ? { email: match[2].trim(), name: match[1].replace(/^['"]|['"]$/g, '').trim() || undefined }
    : { email: sender.trim(), name: undefined };
}

async function storeInboundEmail(event: EmailReceivedEvent, resend: Resend) {
  const { data: email, error } = await resend.emails.receiving.get(event.data.email_id);
  if (error || !email) {
    throw new Error(error?.message ?? 'Resend did not return the received email.');
  }

  const sender = splitSender(email.from);
  const supabaseUrl =
    Netlify.env.get('SUPABASE_URL') ??
    Netlify.env.get('VITE_SUPABASE_URL') ??
    FALLBACK_SUPABASE_URL;

  const response = await fetch(`${supabaseUrl}/functions/v1/inbound-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: sender.email,
      from_name: sender.name,
      to: email.to.join(', '),
      subject: email.subject,
      text: email.text,
      html: email.html,
      attachments: email.attachments.map((attachment) => ({
        filename: attachment.filename ?? 'attachment',
        content_type: attachment.content_type,
        size: attachment.size,
      })),
      thread_id: email.headers?.['in-reply-to'] ?? email.message_id,
      source: 'resend_webhook',
    }),
  });

  if (!response.ok) {
    throw new Error(`Inbound email storage returned HTTP ${response.status}.`);
  }
}

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed.' }, 405);
  }

  const webhookSecret = Netlify.env.get('RESEND_WEBHOOK_SECRET');
  if (!webhookSecret) {
    console.error('RESEND_WEBHOOK_SECRET is not configured.');
    return json({ error: 'Webhook is not configured.' }, 503);
  }

  const payload = await req.text();
  const resend = new Resend(Netlify.env.get('RESEND_API_KEY'));

  let event;
  try {
    event = resend.webhooks.verify({
      payload,
      webhookSecret,
      headers: {
        id: requiredHeader(req, 'svix-id'),
        timestamp: requiredHeader(req, 'svix-timestamp'),
        signature: requiredHeader(req, 'svix-signature'),
      },
    });
  } catch {
    return json({ error: 'Invalid webhook signature.' }, 401);
  }

  if (event.type !== 'email.received') {
    return json({ received: true }, 200);
  }

  if (!Netlify.env.get('RESEND_API_KEY')) {
    console.error('RESEND_API_KEY is required to retrieve received email content.');
    return json({ error: 'Email retrieval is not configured.' }, 503);
  }

  try {
    await storeInboundEmail(event, resend);
    return json({ received: true }, 200);
  } catch (error) {
    console.error('Could not process the received email:', error);
    return json({ error: 'Could not process the webhook.' }, 500);
  }
};

export const config: Config = {
  path: '/api/resend-webhook',
};

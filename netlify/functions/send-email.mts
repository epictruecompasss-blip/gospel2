import type { Config, Context } from '@netlify/functions';
import { Resend } from 'resend';

/**
 * Sends an email to any address through Resend.
 *
 * POST /api/send-email
 *   Authorization: Bearer <Supabase access token of a signed-in admin>
 *   { to, subject, html, text?, cc?, bcc?, replyTo?, attachments?, in_reply_to?, thread_id? }
 *
 * Configuration is read from Netlify environment variables first
 * (RESEND_API_KEY, RESEND_FROM_EMAIL) and falls back to the values saved in
 * the app_config table from the admin dashboard's Email Settings tab.
 */

const DEFAULT_FROM_EMAIL = 'In Him Daily <henry@inhimdaily.org>';

// Public project values — also present in src/lib/supabase.ts.
const FALLBACK_SUPABASE_URL = 'https://iupspzfbhxfikxjleizd.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1cHNwemZiaHhmaWt4amxlaXpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MjYzMTQsImV4cCI6MjEwMzMwMjMxNH0.Gws16H9Bp5Hga_OdsTE51SJmO7AjkPvRM043N0M0AP4';

interface AttachmentMeta {
  filename: string;
  url: string;
  content_type?: string;
  size?: number;
}

interface RequestBody {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string | string[];
  attachments?: AttachmentMeta[];
  in_reply_to?: string;
  thread_id?: string;
}

interface ContactRequestBody {
  name: string;
  email: string;
  message: string;
  subject?: string;
  country?: string;
  city_region?: string;
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

type ResendError = {
  message?: string;
  name?: string;
  statusCode?: number;
};

/** Turns Resend's rejection into useful guidance without exposing credentials. */
function resendErrorMessage(error: ResendError): string {
  const detail = error.message?.trim() || '';
  const normalized = `${error.name ?? ''} ${detail}`.toLowerCase();

  if (error.statusCode === 401 || normalized.includes('api key')) {
    return 'Resend rejected the API key. Update RESEND_API_KEY in Netlify or Email Settings.';
  }
  if (normalized.includes('domain') || normalized.includes('verify') || normalized.includes('from')) {
    return detail
      ? `Resend rejected the sender address: ${detail}`
      : 'Resend rejected the sender address. Verify its domain and update the From address in Email Settings.';
  }
  if (error.statusCode === 429 || normalized.includes('rate limit')) {
    return 'Resend rate-limited this message. Wait briefly and try again.';
  }
  if (normalized.includes('attachment')) {
    return detail ? `Resend rejected an attachment: ${detail}` : 'Resend rejected an attachment.';
  }

  return detail
    ? `Resend could not send this message: ${detail}`
    : 'Resend could not send this message. Check the API key and verified sender domain.';
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function isContactRequest(body: unknown): body is ContactRequestBody {
  if (!body || typeof body !== 'object') return false;
  const candidate = body as Record<string, unknown>;
  return (
    typeof candidate.name === 'string' &&
    typeof candidate.email === 'string' &&
    typeof candidate.message === 'string' &&
    !('to' in candidate) &&
    !('html' in candidate)
  );
}

async function sendContactEmail(body: ContactRequestBody) {
  const name = body.name.trim();
  const email = body.email.trim();
  const message = body.message.trim();
  const subject = body.subject?.trim() || 'General enquiry';

  if (!name || !EMAIL_PATTERN.test(email) || !message) {
    return json({ error: 'A valid name, email address, and message are required.' }, 400);
  }
  if (name.length > 120 || email.length > 254 || subject.length > 200 || message.length > 10_000) {
    return json({ error: 'One or more fields exceed the allowed length.' }, 400);
  }

  // Try the env var key first, then fall back to the database value.
  const envApiKey = Netlify.env.get('RESEND_API_KEY')?.trim() || '';
  let dbApiKey = '';
  if (!envApiKey) {
    const { url, serviceKey } = supabaseConfig();
    if (url && serviceKey) {
      try {
        const resp = await fetch(
          `${url}/rest/v1/app_config?select=value&key=eq.RESEND_API_KEY&limit=1`,
          { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } },
        );
        if (resp.ok) {
          const rows = (await resp.json()) as { value?: string }[];
          dbApiKey = rows?.[0]?.value?.trim() ?? '';
        }
      } catch { /* ignore */ }
    }
  }
  const apiKey = envApiKey || dbApiKey;
  if (!apiKey) {
    return json({ error: 'Email service is not configured.' }, 503);
  }

  const fromEmail = Netlify.env.get('RESEND_FROM_EMAIL') || DEFAULT_FROM_EMAIL;
  const teamEmail = Netlify.env.get('CONTACT_RECEIVING_EMAIL') || 'hello@inhimdaily.org';
  const location = [body.country?.trim(), body.city_region?.trim()].filter(Boolean).join(', ');

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [teamEmail],
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New contact form submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        ${location ? `<p><strong>Location:</strong> ${escapeHtml(location)}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap">${escapeHtml(message)}</p>
      `,
      text: `New contact form submission from ${name} (${email})\n\nSubject: ${subject}\n\n${message}${location ? `\n\nLocation: ${location}` : ''}`,
    });

    if (error) {
      console.error('Resend rejected the contact message:', error);
      return json({ error: 'The email service could not send your message.' }, 502);
    }

    return json({ success: true, id: data?.id ?? null }, 200);
  } catch (err) {
    console.error('Unexpected contact email error:', err);
    return json({ error: 'Could not send your message. Please try again.' }, 500);
  }
}

function supabaseConfig() {
  return {
    url: Netlify.env.get('SUPABASE_URL') ?? Netlify.env.get('VITE_SUPABASE_URL') ?? FALLBACK_SUPABASE_URL,
    anonKey:
      Netlify.env.get('SUPABASE_ANON_KEY') ??
      Netlify.env.get('VITE_SUPABASE_ANON_KEY') ??
      FALLBACK_SUPABASE_ANON_KEY,
    serviceKey: Netlify.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  };
}

/** Confirms the bearer token belongs to a signed-in Supabase user. */
async function verifyAdmin(token: string): Promise<{ id: string; email?: string } | null> {
  const { url, anonKey } = supabaseConfig();
  const response = await fetch(`${url}/auth/v1/user`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${token}` },
  });
  if (!response.ok) return null;
  const user = (await response.json()) as { id?: string; email?: string };
  return user?.id ? { id: user.id, email: user.email } : null;
}

/** Reads a value from app_config using the admin's own token (RLS allows authenticated reads). */
async function getConfigValue(key: string, token: string): Promise<string> {
  const { url, anonKey } = supabaseConfig();
  try {
    const response = await fetch(
      `${url}/rest/v1/app_config?select=value&key=eq.${encodeURIComponent(key)}&limit=1`,
      { headers: { apikey: anonKey, Authorization: `Bearer ${token}` } },
    );
    if (!response.ok) return '';
    const rows = (await response.json()) as { value?: string }[];
    return rows?.[0]?.value?.trim() ?? '';
  } catch {
    return '';
  }
}

/** Records the sent message in admin_emails so it shows up in the Inbox thread. */
async function logOutboundEmail(
  token: string,
  record: Record<string, unknown>,
): Promise<void> {
  const { url, anonKey } = supabaseConfig();
  try {
    await fetch(`${url}/rest/v1/admin_emails`, {
      method: 'POST',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(record),
    });
  } catch (err) {
    console.error('Could not record the outbound email:', err);
  }
}

const EMAIL_PATTERN = /^[^\s@,<>]+@[^\s@,<>]+\.[^\s@,<>]+$/;

/** Accepts a single address or a list and returns the clean, valid ones. */
function normalizeRecipients(value: string | string[] | undefined): string[] {
  if (!value) return [];
  const candidates = Array.isArray(value) ? value : value.split(',');
  return candidates.map((entry) => entry.trim()).filter((entry) => EMAIL_PATTERN.test(entry));
}

export default async (req: Request, _context: Context) => {
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed.' }, 405);
  }

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return json({ error: 'Could not read the request body.' }, 400);
  }

  // Public contact submissions can only send to the fixed team inbox. The
  // authenticated path below retains support for arbitrary admin recipients.
  if (isContactRequest(rawBody)) {
    return sendContactEmail(rawBody);
  }

  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim();
  if (!token) {
    return json({ error: 'You must be signed in to send email.' }, 401);
  }

  const admin = await verifyAdmin(token);
  if (!admin) {
    return json({ error: 'Your session has expired. Please sign in again.' }, 401);
  }

  const body = rawBody as RequestBody;

  const to = normalizeRecipients(body.to);
  if (to.length === 0) {
    return json({ error: 'A valid recipient email address is required.' }, 400);
  }
  if (!body.subject?.trim() || !body.html?.trim()) {
    return json({ error: 'Subject and message body are required.' }, 400);
  }

  // Collect all possible API keys — env var first, then the database value.
  const environmentApiKey = Netlify.env.get('RESEND_API_KEY')?.trim() || '';
  const dbApiKey = await getConfigValue('RESEND_API_KEY', token);
  const apiKeys = [environmentApiKey, dbApiKey].filter((k, i, arr) => k && arr.indexOf(k) === i);
  if (apiKeys.length === 0) {
    return json(
      {
        error:
          'Email service is not configured. Add RESEND_API_KEY as a Netlify environment variable, or save your Resend API key in Email Settings.',
      },
      503,
    );
  }

  const fromEmail =
    Netlify.env.get('RESEND_FROM_EMAIL') ||
    (await getConfigValue('RESEND_FROM_EMAIL', token)) ||
    DEFAULT_FROM_EMAIL;

  const cc = normalizeRecipients(body.cc);
  const bcc = normalizeRecipients(body.bcc);
  const replyTo = normalizeRecipients(body.replyTo);

  const emailParams = {
    from: fromEmail,
    to,
    subject: body.subject.trim(),
    html: body.html,
    ...(body.text ? { text: body.text } : {}),
    ...(cc.length > 0 ? { cc } : {}),
    ...(bcc.length > 0 ? { bcc } : {}),
    ...(replyTo.length > 0 ? { replyTo } : {}),
    ...(body.attachments?.length
      ? {
          attachments: body.attachments.map((attachment) => ({
            filename: attachment.filename,
            path: attachment.url,
          })),
        }
      : {}),
  };

  // Try each candidate key; stop at the first one Resend accepts.
  let lastError: ResendError | null = null;
  for (const candidateKey of apiKeys) {
    try {
      const resend = new Resend(candidateKey);
      const { data, error } = await resend.emails.send(emailParams);

      if (!error) {
        await logOutboundEmail(token, {
          direction: 'outbound',
          from_email: fromEmail,
          from_name: 'In Him Daily',
          to_email: to.join(', '),
          subject: body.subject.trim(),
          body_text: body.text ?? null,
          body_html: body.html,
          attachments: body.attachments ?? [],
          status: 'sent',
          in_reply_to: body.in_reply_to ?? null,
          thread_id: body.thread_id ?? crypto.randomUUID(),
          source: 'admin_compose',
        });

        return json({ success: true, id: data?.id ?? null, message: 'Email sent successfully.' }, 200);
      }

      lastError = error as ResendError;
      console.error('Resend rejected the message with a candidate key.', {
        name: error.name,
        statusCode: error.statusCode,
        message: error.message,
      });

      // If it's an auth/key error, try the next key; otherwise stop.
      const isAuthError =
        error.statusCode === 401 ||
        `${error.name ?? ''} ${error.message ?? ''}`.toLowerCase().includes('api key');
      if (!isAuthError) break;
    } catch (err) {
      console.error('Unexpected error while sending email:', err);
      return json({ error: 'Could not send the email. Please try again.' }, 500);
    }
  }

  return json({ error: resendErrorMessage(lastError ?? {}) }, 502);
};

export const config: Config = {
  path: ['/api/send-email', '/.netlify/functions/send-email'],
};

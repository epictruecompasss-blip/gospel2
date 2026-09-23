import { createClient } from "npm:@supabase/supabase-js@2.58.0";
import { Resend } from "npm:resend@6.25.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const DEFAULT_FROM_EMAIL = "In Him Daily <noreply@inhimdaily.org>";
const TEAM_EMAIL = "hello@inhimdaily.org";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

async function getConfig(
  supabase: ReturnType<typeof createClient>,
  key: string,
): Promise<string> {
  const { data, error } = await supabase
    .from("app_config")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (error || !data) return "";
  return data.value as string;
}

interface RequestBody {
  name: string;
  email: string;
  subject: string;
  message: string;
  country?: string;
  city_region?: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildTeamEmailHtml(data: RequestBody): string {
  const location = [data.country, data.city_region]
    .filter(Boolean)
    .join(", ");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0E2035;font-family:Georgia,'Times New Roman',serif;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0E2035;min-height:100vh;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#13294a;border:1px solid rgba(228,184,106,0.2);border-radius:16px;overflow:hidden;">

          <tr>
            <td align="center" style="padding:36px 40px 20px;background:linear-gradient(180deg,rgba(201,152,58,0.08) 0%,transparent 100%);">
              <p style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#C9983A;font-weight:bold;margin:0 0 8px 0;">In Him Daily — Contact Form</p>
              <h1 style="font-size:24px;color:#ffffff;margin:0;font-weight:bold;">New Contact Message</h1>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:rgba(255,255,255,0.04);border-radius:12px;border:1px solid rgba(255,255,255,0.08);">
                <tr>
                  <td style="padding:24px 28px;">
                    <p style="font-size:13px;color:#C9983A;font-weight:bold;text-transform:uppercase;letter-spacing:0.12em;margin:0 0 16px 0;">Sender Details</p>
                    <p style="font-size:15px;color:rgba(255,255,255,0.85);margin:0 0 8px 0;"><strong>Name:</strong> ${escapeHtml(data.name)}</p>
                    <p style="font-size:15px;color:rgba(255,255,255,0.85);margin:0 0 8px 0;"><strong>Email:</strong> <a href="mailto:${escapeHtml(data.email)}" style="color:#C9983A;text-decoration:none;">${escapeHtml(data.email)}</a></p>
                    ${location ? `<p style="font-size:15px;color:rgba(255,255,255,0.85);margin:0 0 8px 0;"><strong>Location:</strong> ${escapeHtml(location)}</p>` : ""}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 24px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:rgba(255,255,255,0.04);border-radius:12px;border:1px solid rgba(255,255,255,0.08);">
                <tr>
                  <td style="padding:24px 28px;">
                    <p style="font-size:13px;color:#C9983A;font-weight:bold;text-transform:uppercase;letter-spacing:0.12em;margin:0 0 12px 0;">Subject</p>
                    <p style="font-size:17px;color:rgba(255,255,255,0.9);margin:0 0 20px 0;">${escapeHtml(data.subject)}</p>
                    <p style="font-size:13px;color:#C9983A;font-weight:bold;text-transform:uppercase;letter-spacing:0.12em;margin:0 0 12px 0;">Message</p>
                    <p style="font-size:15px;color:rgba(255,255,255,0.75);line-height:1.7;margin:0;white-space:pre-wrap;">${escapeHtml(data.message)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:0 40px 40px 40px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background-color:#C9983A;border-radius:30px;padding:14px 36px;">
                    <a href="mailto:${escapeHtml(data.email)}?subject=Re: ${encodeURIComponent(data.subject)}" style="font-size:14px;color:#0E2035;text-decoration:none;font-weight:bold;">Reply to ${escapeHtml(data.name)}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:0 40px 32px 40px;">
              <p style="font-size:12px;color:rgba(255,255,255,0.35);line-height:1.5;margin:0;">
                In Him Daily — Contact Form Notification<br/>
                This message was submitted via the contact form at inhimdaily.org
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed." }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    const body: RequestBody = await req.json();

    if (!body.name?.trim() || !body.email?.trim() || !body.subject?.trim() || !body.message?.trim()) {
      return new Response(
        JSON.stringify({ error: "Name, email, subject, and message are all required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Server not configured." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Save the message to the database
    const { error: dbError } = await supabase.from("contact_messages").insert({
      name: body.name.trim(),
      email: body.email.trim(),
      subject: body.subject.trim(),
      message: body.message.trim(),
      country: body.country ?? null,
      city_region: body.city_region ?? null,
    });

    if (dbError) {
      console.error("Database error:", dbError.message);
      return new Response(
        JSON.stringify({ error: "Could not save your message. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Send notification email to the team via Resend
    const RESEND_API_KEY = await getConfig(supabase, "RESEND_API_KEY");
    const FROM_EMAIL = (await getConfig(supabase, "RESEND_FROM_EMAIL")) || DEFAULT_FROM_EMAIL;

    if (RESEND_API_KEY) {
      try {
        const resend = new Resend(RESEND_API_KEY);
        const { error: sendError } = await resend.emails.send({
          from: FROM_EMAIL,
          to: TEAM_EMAIL,
          replyTo: body.email.trim(),
          subject: `Contact Form: ${body.subject.trim()}`,
          html: buildTeamEmailHtml(body),
          text: `New contact form submission from ${body.name} (${body.email})\n\nSubject: ${body.subject}\n\nMessage:\n${body.message}\n\nLocation: ${[body.country, body.city_region].filter(Boolean).join(", ") || "Not provided"}`,
        });

        if (sendError) {
          console.error("Resend SDK error:", sendError);
        }
      } catch (emailErr) {
        console.error("Email send failed:", emailErr);
      }
    } else {
      console.error("RESEND_API_KEY is not configured — message saved, email skipped");
    }

    return new Response(
      JSON.stringify({ success: true, message: "Your message has been received." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

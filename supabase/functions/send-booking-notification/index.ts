import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface BookingNotificationRequest {
  adminEmail: string;
  customerName: string;
  phoneNumber: string;
  location: string;
  service: string;
  problemDescription?: string;
  preferredDate?: string;
  preferredTime?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      adminEmail,
      customerName,
      phoneNumber,
      location,
      service,
      problemDescription,
      preferredDate,
      preferredTime,
    }: BookingNotificationRequest = await req.json();

    console.log("Sending booking notification to:", adminEmail);

    if (!adminEmail || !customerName || !phoneNumber || !location || !service) {
      throw new Error("Missing required fields");
    }

    const timeLabel = preferredTime === "morning" 
      ? "Morning (8 AM - 12 PM)" 
      : preferredTime === "afternoon" 
        ? "Afternoon (12 PM - 4 PM)" 
        : preferredTime === "evening"
          ? "Evening (4 PM - 8 PM)"
          : "";

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #dc2626; }
          .value { margin-top: 4px; }
          .cta { background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 15px; }
          .footer { padding: 15px; text-align: center; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">🛠️ New Booking Request</h1>
            <p style="margin: 10px 0 0 0;">QuickServe - Coimbatore</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">👤 Customer Name</div>
              <div class="value">${customerName}</div>
            </div>
            <div class="field">
              <div class="label">📞 Phone Number</div>
              <div class="value"><a href="tel:${phoneNumber}">${phoneNumber}</a></div>
            </div>
            <div class="field">
              <div class="label">📍 Location</div>
              <div class="value">${location}</div>
            </div>
            <div class="field">
              <div class="label">🔧 Service Required</div>
              <div class="value">${service}</div>
            </div>
            ${problemDescription ? `
            <div class="field">
              <div class="label">📝 Problem Description</div>
              <div class="value">${problemDescription}</div>
            </div>
            ` : ""}
            ${preferredDate ? `
            <div class="field">
              <div class="label">📅 Preferred Date</div>
              <div class="value">${preferredDate}</div>
            </div>
            ` : ""}
            ${timeLabel ? `
            <div class="field">
              <div class="label">⏰ Preferred Time</div>
              <div class="value">${timeLabel}</div>
            </div>
            ` : ""}
            <a href="tel:${phoneNumber}" class="cta">📞 Call Customer Now</a>
            <a href="https://wa.me/91${phoneNumber}" class="cta" style="margin-left: 10px;">💬 WhatsApp</a>
          </div>
          <div class="footer">
            <p>This is an automated notification from QuickServe booking system.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "QuickServe <onboarding@resend.dev>",
        to: [adminEmail],
        subject: `🔔 New Booking Request - ${service}`,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Resend API error:", error);
      throw new Error(`Failed to send email: ${error}`);
    }

    const data = await res.json();
    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-booking-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

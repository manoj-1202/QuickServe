import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") || "admin@example.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface BookingNotificationRequest {
  customerName: string;
  phoneNumber: string;
  location: string;
  service: string;
  problemDescription?: string;
  preferredDate?: string;
  preferredTime?: string;
}

// Rate limiting using in-memory store (per function instance)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // max 5 requests per minute per IP

function isRateLimited(clientIp: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(clientIp);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }
  
  record.count++;
  return false;
}

// HTML escape function to prevent XSS/HTML injection
function escapeHtml(text: string): string {
  if (!text) return "";
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Input validation schema
function validateInput(data: BookingNotificationRequest): { valid: boolean; error?: string } {
  if (!data.customerName || typeof data.customerName !== 'string' || data.customerName.length > 100) {
    return { valid: false, error: "Invalid customer name" };
  }
  if (!data.phoneNumber || !/^[6-9]\d{9}$/.test(data.phoneNumber)) {
    return { valid: false, error: "Invalid phone number" };
  }
  if (!data.location || typeof data.location !== 'string' || data.location.length > 200) {
    return { valid: false, error: "Invalid location" };
  }
  if (!data.service || typeof data.service !== 'string' || data.service.length > 100) {
    return { valid: false, error: "Invalid service" };
  }
  if (data.problemDescription && (typeof data.problemDescription !== 'string' || data.problemDescription.length > 1000)) {
    return { valid: false, error: "Invalid problem description" };
  }
  return { valid: true };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Rate limiting check
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("cf-connecting-ip") || 
                     "unknown";
    
    if (isRateLimited(clientIp)) {
      console.log(`Rate limit exceeded for IP: ${clientIp}`);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const requestData: BookingNotificationRequest = await req.json();
    
    // Validate input
    const validation = validateInput(requestData);
    if (!validation.valid) {
      console.log(`Validation failed: ${validation.error}`);
      return new Response(
        JSON.stringify({ error: validation.error }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const {
      customerName,
      phoneNumber,
      location,
      service,
      problemDescription,
      preferredDate,
      preferredTime,
    } = requestData;

    console.log("Sending booking notification to admin");

    const timeLabel = preferredTime === "morning" 
      ? "Morning (8 AM - 12 PM)" 
      : preferredTime === "afternoon" 
        ? "Afternoon (12 PM - 4 PM)" 
        : preferredTime === "evening"
          ? "Evening (4 PM - 8 PM)"
          : "";

    // Escape all user inputs to prevent HTML injection
    const safeCustomerName = escapeHtml(customerName);
    const safePhoneNumber = escapeHtml(phoneNumber);
    const safeLocation = escapeHtml(location);
    const safeService = escapeHtml(service);
    const safeProblemDescription = problemDescription ? escapeHtml(problemDescription) : "";
    const safePreferredDate = preferredDate ? escapeHtml(preferredDate) : "";
    const safeTimeLabel = escapeHtml(timeLabel);

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
            <p style="margin: 10px 0 0 0;">QuickServee - Coimbatore</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">👤 Customer Name</div>
              <div class="value">${safeCustomerName}</div>
            </div>
            <div class="field">
              <div class="label">📞 Phone Number</div>
              <div class="value"><a href="tel:${safePhoneNumber}">${safePhoneNumber}</a></div>
            </div>
            <div class="field">
              <div class="label">📍 Location</div>
              <div class="value">${safeLocation}</div>
            </div>
            <div class="field">
              <div class="label">🔧 Service Required</div>
              <div class="value">${safeService}</div>
            </div>
            ${safeProblemDescription ? `
            <div class="field">
              <div class="label">📝 Problem Description</div>
              <div class="value">${safeProblemDescription}</div>
            </div>
            ` : ""}
            ${safePreferredDate ? `
            <div class="field">
              <div class="label">📅 Preferred Date</div>
              <div class="value">${safePreferredDate}</div>
            </div>
            ` : ""}
            ${safeTimeLabel ? `
            <div class="field">
              <div class="label">⏰ Preferred Time</div>
              <div class="value">${safeTimeLabel}</div>
            </div>
            ` : ""}
            <a href="tel:${safePhoneNumber}" class="cta">📞 Call Customer Now</a>
            <a href="https://wa.me/91${safePhoneNumber}" class="cta" style="margin-left: 10px;">💬 WhatsApp</a>
          </div>
          <div class="footer">
            <p>This is an automated notification from QuickServee booking system.</p>
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
        from: "QuickServee <onboarding@resend.dev>",
        to: [ADMIN_EMAIL],
        subject: `🔔 New Booking Request - ${safeService}`,
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
      JSON.stringify({ error: "Failed to process request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

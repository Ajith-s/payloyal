# PayLoyal MVP site

A static landing page + merchant dashboard demo for a UPI payments/customer-insights product for Indian cafes and small businesses.

## Files

- `index.html` — public landing page for payment-provider review
- `app.html` — merchant dashboard demo with simulated UPI payments
- `privacy.html`, `terms.html`, `refund.html` — basic policy pages
- `styles.css`, `app.js` — shared UI and dashboard simulation

## Demo credentials

- Email: `demo@payloyal.in`
- Password: `Demo@1234`

## Run locally

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Payment provider notes

This prototype does not process real payments yet. It is intended to establish a public web presence and app review surface before applying for production payment APIs.

## Cashfree sandbox checkout

This site includes a Netlify Function for creating Cashfree sandbox orders:

- Page: `/checkout.html`
- Function: `/.netlify/functions/create-cashfree-order`
- Webhook receiver: `/.netlify/functions/cashfree-webhook`

Set these in Netlify environment variables:

```text
CASHFREE_ENV=sandbox
CASHFREE_CLIENT_ID=<your test client id>
CASHFREE_CLIENT_SECRET=<your test client secret>
CASHFREE_API_VERSION=2025-01-01
PAYLOYAL_SITE_URL=https://payloyal.netlify.app
```

Do not store real API secrets in source files or browser code.

For Cashfree webhook testing, configure the webhook URL as:

```text
https://payloyal.in/.netlify/functions/cashfree-webhook
```

Use the Netlify URL until DNS finishes propagating if needed:

```text
https://payloyal.netlify.app/.netlify/functions/cashfree-webhook
```

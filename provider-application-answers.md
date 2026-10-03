# PayLoyal — payment provider application answers

Use these responses when Cashfree/other payment providers ask about the business, website, app, or payment flow.

## Website URL

Primary domain, once DNS propagation completes:

- https://payloyal.in

Temporary Netlify URL:

- https://payloyal.netlify.app

## App / dashboard URL

- https://payloyal.in/app.html
- Temporary: https://payloyal.netlify.app/app.html

## Test login details

- Email: demo@payloyal.in
- Password: Demo@1234

## Business description

PayLoyal is a merchant-side software platform for cafes and small businesses in India. It helps merchants accept UPI payments, understand repeat vs new customers, configure loyalty rewards, and receive simple daily business reports.

## What are you collecting payments for?

PayLoyal will collect UPI payments from end customers on behalf of onboarded merchants such as cafes, bakeries, salons, and small local sellers. Customers pay the merchant for goods or services purchased in-store. The merchant receives transaction analytics and optional loyalty/reward tooling through PayLoyal.

## Payment flow

1. Merchant signs up on PayLoyal.
2. Merchant completes KYC and bank setup required by the payment provider.
3. PayLoyal provisions a UPI QR/VPA for the merchant.
4. Customer scans the QR at the store and pays using any UPI app.
5. Payment provider confirms payment and sends PayLoyal a webhook.
6. PayLoyal shows transactions, customer repeat/new classification, rewards, and AI-powered reports to the merchant.

## Payment modes requested

- UPI QR / UPI collect / UPI intent where supported
- Static QR for offline merchant counters
- Webhooks for payment success/failure/refund/settlement status

## Required payment-provider capabilities

- Static UPI QR or VPA per merchant/store
- Real-time webhook for every successful payment
- Merchant/sub-merchant onboarding flow
- Settlement to merchant bank account where supported
- Payment reference/RRN/transaction ID for reconciliation
- Payer VPA or stable payer identifier when available and permitted, for customer insight analytics

## Refund policy summary

Subscription fees may be refunded within 7 days for incorrect charges or service access issues. Refunds for customer purchases are handled by the merchant according to their store policy and payment provider refund process.

## Support contact

- ajithshrm@gmail.com

## Current status

PayLoyal is in MVP/pilot stage. The current dashboard uses simulated payment data while payment-provider production approval is in progress.

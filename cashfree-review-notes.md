# Cashfree review notes — PayLoyal

## Business description

PayLoyal is a merchant-side software product for cafes and small businesses in India. It helps merchants accept UPI payments, understand repeat vs new customers, configure simple loyalty rewards, and receive daily business reports.

## Payment flow

1. Merchant signs up for PayLoyal.
2. Merchant completes KYC/bank setup through the payment provider.
3. PayLoyal generates/provisions a UPI QR for the merchant.
4. Customer scans the QR and pays using any UPI app.
5. PayLoyal receives payment status via webhook and shows analytics in the merchant dashboard.

## Website/app URL

- Landing page: `https://payloyal.in` once deployed
- Demo dashboard: `/app.html`

## Test login

- Email: `demo@payloyal.in`
- Password: `Demo@1234`

## Required provider capabilities

- Static UPI QR/VPA per merchant
- Real-time payment webhooks
- Merchant/sub-merchant onboarding
- Settlement to merchant bank account
- Payer VPA or stable payer identifier when available for customer insight analytics

# Payment provider checklist for PayLoyal

## Before applying

- [x] Domain purchased: payloyal.in
- [x] Landing page created
- [x] Dashboard demo created
- [x] Privacy Policy page
- [x] Terms & Conditions page
- [x] Refund & Cancellation Policy page
- [x] Test login details available
- [ ] DNS fully propagated
- [ ] Production provider account approved
- [ ] KYC completed
- [ ] Bank account linked

## Ask Cashfree / Decentro / Razorpay

1. Can PayLoyal onboard multiple offline merchants/sub-merchants?
2. Can each merchant get a static UPI QR/VPA for their store counter?
3. Can customers pay using any UPI app?
4. Do payment webhooks include payer VPA or another stable payer identifier?
5. Is PayLoyal allowed to store hashed payer identifiers for customer insight analytics?
6. Can settlement go directly to each merchant's bank account?
7. If settlement goes through platform flow, what licenses/compliance apply?
8. What KYC is required for small cafes/sole proprietors?
9. What are settlement timelines and fees?
10. Are refunds supported through API?
11. Is there a sandbox for static QR/offline UPI collections?
12. Are WhatsApp receipts/reward messages allowed if customers opt in?

## Red flags

- No payer identifier in webhook
- No static QR for offline counter payments
- Funds must settle to PayLoyal before merchant without clear compliance path
- Manual onboarding for every merchant with high friction
- No sandbox or poor webhook reliability
- Contract prevents loyalty/customer analytics use case

## Minimum viable production setup

- One pilot merchant
- Static QR displayed at counter
- Payment webhook into PayLoyal backend
- Transaction shown in dashboard within seconds/minutes
- Repeat/new classification based on payer identifier if available
- AI report generated automatically

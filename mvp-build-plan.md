# PayLoyal MVP build plan

## Goal

Build a credible MVP that can be shown to payment providers and 5-10 pilot merchants.

## Phase 1 — Public presence and demo

Status: mostly complete.

- Landing page
- Merchant dashboard demo
- Policy pages
- Test login
- Netlify deployment
- payloyal.in DNS setup

## Phase 2 — Real app foundation

Build a simple backend and database with a mock payment provider.

### Core objects

- Merchant
- Payment QR
- Payment
- Customer
- Reward rule
- Reward event
- AI report

### Backend endpoints

- `POST /api/merchants`
- `GET /api/merchants/:id/dashboard`
- `POST /api/mock-payments`
- `POST /api/webhooks/:provider`
- `GET /api/reports/daily/:merchantId`
- `POST /api/reward-rules`

### Mock provider

Simulate payment webhooks so the product can be built before payment approval.

Example mock payment:

```json
{
  "merchant_id": "m_blue_bean",
  "amount": 180,
  "payer_vpa": "riya@okaxis",
  "provider_payment_id": "mock_pay_001",
  "rrn": "123456789012",
  "paid_at": "2026-10-03T18:05:00+05:30",
  "status": "success"
}
```

## Phase 3 — Payment provider integration

Start with the provider that grants sandbox/production access fastest.

Priority order:

1. Cashfree Embedded Payments / Offline Payments
2. Decentro Offline Static QR
3. Razorpay QR APIs if onboarding becomes available
4. PhonePe only if partner path is clear

## Phase 4 — Pilot merchants

Target 5 cafes/bakeries/salons.

Pilot pitch:

> PayLoyal helps you know who is new, who came back, when sales peak, and which customers are close to rewards. Customers pay with UPI like they already do. No customer app needed.

## Phase 5 — WhatsApp reports

Start manually or via WhatsApp Business API after opt-in.

AI report format:

```text
PayLoyal AI report — Blue Bean Cafe

Sales: ₹18,420
Payments: 86
Average order: ₹214
New customers: 52
Returning customers: 34
Peak hour: 6–7 PM

12 customers are close to a reward.
Suggested action: remind regulars about the 5-visit reward.
```

# PayLoyal customer reward flow — no app install

## Important constraint

If a merchant displays a plain static UPI QR directly from a payment processor, the customer pays entirely inside Google Pay, PhonePe, Paytm, BHIM, etc. PayLoyal generally cannot insert an intermediate screen after scan unless the QR opens a PayLoyal-controlled web page first.

## Recommended flow

Use a PayLoyal web QR instead of a raw UPI QR.

1. Customer scans merchant's PayLoyal QR.
2. QR opens a mobile web page such as `/customer.html?merchant=blue-bean`.
3. Customer enters/accepts amount, then taps `Pay with UPI app`.
4. PayLoyal launches a UPI intent/deep link or payment-provider checkout.
5. While payment is being processed, PayLoyal shows: `Your payment is being processed. Enter your phone number to get rewards.`
6. Customer can enter phone number and consent to reward messages, or skip.
7. Payment provider webhook confirms payment.
8. PayLoyal links payment VPA/customer token to phone number only if the customer opted in.

## Why this works

- No customer app install.
- Customer still pays with their existing UPI app.
- PayLoyal controls the pre/post payment web surface.
- Phone number collection is explicit and optional.
- Merchant sees aggregate opt-in metrics, not phone numbers.

## Tradeoff

This requires customers to scan a PayLoyal QR that opens a web page, not a pure static UPI QR that opens the UPI app immediately. If using a pure static UPI QR, phone opt-in must happen through a separate QR, receipt link, or merchant-assisted flow.

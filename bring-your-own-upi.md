# Bring your own UPI — PayLoyal mode

Tagline: **Bring your own UPI — get insights, drive loyalty with PayLoyal.**

## Merchant promise

Merchants can keep their existing bank UPI ID and settlement account. PayLoyal adds a branded QR payment page, customer reward opt-in, loyalty tracking, and AI reporting on top.

## Flow

1. Merchant enters existing UPI ID, for example `bluebeancafe@okaxis`.
2. PayLoyal validates the VPA format and can ask for a small test payment later.
3. PayLoyal creates a merchant page, for example `/pay.html?merchant=blue-bean-cafe`.
4. Customer scans the printed PayLoyal QR.
5. Customer enters amount.
6. PayLoyal opens UPI intent to the merchant's existing VPA.
7. Customer returns to PayLoyal and can enter phone number for rewards or skip.
8. Reward claim is marked pending verification.

## Verification options

- Merchant confirms payment in dashboard/app.
- Merchant notification/SMS confirms payment.
- Bank statement later confirms payment.
- Customer enters UPI reference number.

## Positioning caveat

Bring-your-own-UPI initiates payments directly to the merchant's UPI ID, but does not provide bank-grade automatic confirmation unless a verification source is connected. For the MVP, reward claims can be merchant-confirmed.

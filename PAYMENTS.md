# Marketplace payment setup

Premium themes use Paystack-hosted checkout. The server fixes the allowed product and price, initializes the transaction, and verifies its status, currency, amount, and theme before the client marks a theme as owned.

## Local development

1. Rotate the Paystack secret key that was pasted into chat. Use a **test** secret key while developing.
2. Copy `.env.example` to `.env.local` and set `PAYSTACK_SECRET_KEY` to the rotated test key. Keep this file private; it is ignored by Git.
3. Run `npm run dev`. Vite exposes the server-side payment API at `/api/paystack/*`.

The products are currently priced at USD 2.99 and USD 3.99. Paystack must have USD enabled for the account. Set `APP_URL` to the app's public URL in production and route `/api/paystack/*` to `node server.js`, with `PAYSTACK_SECRET_KEY` and `PAYSTACK_CURRENCY=USD` set in the server's environment. Never add the secret to a `VITE_` variable or browser code.

Successful checkout returns to the app, which verifies the reference with the server before unlocking the purchased theme. Ownership is stored in that browser's local storage; it is not an account-wide entitlement system.

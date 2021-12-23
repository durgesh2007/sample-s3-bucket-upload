import { loadStripe } from '@stripe/stripe-js';
import React from 'react';
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.STRIPE_PUBLISHABLE_KEY
);
export default function PreviewPage() {
  React.useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      console.log('Order placed! You will receive an email confirmation.');
    }
    if (query.get('canceled')) {
      console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
    }
  }, []);

  return (
    <div>
      <form action="/api/checkout/sessions?plan=lite" method="POST">
        <section>
          <button type="submit">
            Purchase Lite
          </button>
        </section>
      </form>
      <form action="/api/checkout/sessions?plan=medium" method="POST">
        <section>
          <button type="submit">
            Purchase Medium
          </button>
        </section>
      </form>
      <form action="/api/checkout/sessions?plan=full" method="POST">
        <section>
          <button type="submit">
            Purchase Full
          </button>
        </section>
      </form>
      <form action="/api/checkout/sessions?plan=investor" method="POST">
        <section>
          <button type="submit">
            Subscribe as Investor
          </button>
        </section>
      </form>
      <style jsx>
        {`
          section {
            background: #ffffff;
            display: flex;
            flex-direction: column;
            width: 400px;
            height: 75px;
            border-radius: 6px;
            justify-content: space-between;
          }
          button {
            height: 36px;
            background: #556cd6;
            border-radius: 4px;
            color: white;
            border: 0;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
          }
          button:hover {
            opacity: 0.8;
          }
        `}
      </style>
    </div>
  );
}
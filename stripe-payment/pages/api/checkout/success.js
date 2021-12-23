const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // filename plan_success.js
      // Create Checkout Sessions from query params.
      const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
      const customer = await stripe.customers.retrieve(session.customer);
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription
      );
      // delete handler
      const deleted = await stripe.subscriptions.del(
        session.subscription
      );
      console.log(session);
      console.log(customer);
      console.log(subscription);
      console.log(deleted);
      // return customer;
      res.redirect(`${process.env.APP_BASE_URL}/success`);
    } catch (err) {
      res.status(err.statusCode || 500).json(err);
    }
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
}
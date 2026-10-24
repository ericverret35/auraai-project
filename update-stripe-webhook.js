import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

async function main() {
  // Update the first webhook to include all required events
  const requiredEvents = [
    'checkout.session.completed',
    'checkout.session.async_payment_succeeded',
    'invoice.payment_succeeded',
    'invoice.payment_failed',
    'invoice.paid',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
    'payment_intent.succeeded',
    'payment_intent.payment_failed'
  ];

  // Update we_1U3OPvF6K5id8tC4nG9JHFxy
  const updated = await stripe.webhookEndpoints.update(
    'we_1U3OPvF6K5id8tC4nG9JHFxy',
    { enabled_events: requiredEvents }
  );
  
  console.log('✅ Webhook updated:', updated.id);
  console.log('URL:', updated.url);
  console.log('Events:', updated.enabled_events.join(', '));
}

main().catch(console.error);

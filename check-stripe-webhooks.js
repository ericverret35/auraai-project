import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

async function main() {
  // List existing webhook endpoints
  const webhooks = await stripe.webhookEndpoints.list({ limit: 10 });
  console.log('Existing webhook endpoints:');
  webhooks.data.forEach(w => {
    console.log(`  - ${w.id}: ${w.url} (events: ${w.enabled_events.join(', ')})`);
  });
  
  // Check if our endpoint already exists
  const ourEndpoint = webhooks.data.find(w => w.url.includes('/api/stripe/webhook'));
  if (ourEndpoint) {
    console.log('\n✅ Webhook endpoint already exists:', ourEndpoint.id);
  } else {
    console.log('\n❌ No webhook endpoint found for /api/stripe/webhook');
  }
}

main().catch(console.error);

import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

async function main() {
  // Delete the duplicate webhooks (keep we_1U3OPvF6K5id8tC4nG9JHFxy)
  const toDelete = [
    'we_1U2eIdF6K5id8tC4eRowqSpt',
    'we_1U20bCF6K5id8tC4oAhFWQAd',
    'we_1TcdSLF6K5id8tC4CNgDySvo'  // This one is for a different app
  ];

  for (const id of toDelete) {
    try {
      await stripe.webhookEndpoints.del(id);
      console.log(`✅ Deleted webhook: ${id}`);
    } catch (e) {
      console.log(`⚠️ Could not delete ${id}:`, e.message);
    }
  }
  
  // List remaining
  const webhooks = await stripe.webhookEndpoints.list({ limit: 10 });
  console.log('\nRemaining webhooks:');
  webhooks.data.forEach(w => {
    console.log(`  - ${w.id}: ${w.url} (${w.enabled_events.length} events)`);
  });
}

main().catch(console.error);

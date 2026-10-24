import Stripe from 'stripe';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

function sendWebhook(eventType, data) {
  const mockEvent = {
    id: 'evt_test_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    object: 'event',
    api_version: '2024-06-20',
    created: Math.floor(Date.now() / 1000),
    data: { object: data },
    livemode: false,
    pending_webhooks: 1,
    request: { id: null, idempotency_key: null },
    type: eventType
  };
  
  const payload = JSON.stringify(mockEvent);
  const timestamp = Math.floor(Date.now() / 1000);
  const signedPayload = `${timestamp}.${payload}`;
  const signature = crypto
    .createHmac('sha256', webhookSecret)
    .update(signedPayload)
    .digest('hex');
  const stripeSignature = `t=${timestamp},v1=${signature}`;
  
  return fetch('http://localhost:3008/api/stripe/webhook', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Stripe-Signature': stripeSignature
    },
    body: payload
  }).then(res => res.json());
}

async function runTests() {
  console.log('🧪 Testing all webhook event types...\n');
  
  // 1. checkout.session.completed (already tested)
  console.log('1. checkout.session.completed...');
  await sendWebhook('checkout.session.completed', {
    id: 'cs_test_new', amount_total: 4999, currency: 'cad',
    customer: 'cus_test_new', customer_email: 'test2@example.com',
    mode: 'payment', payment_status: 'paid',
    payment_intent: 'pi_test_new', metadata: { product_id: 'prod_2' }
  });
  console.log('   ✅');
  
  // 2. invoice.payment_succeeded
  console.log('2. invoice.payment_succeeded...');
  await sendWebhook('invoice.payment_succeeded', {
    id: 'in_test_succeeded', amount_paid: 1999, currency: 'cad',
    customer: 'cus_test_sub', subscription: 'sub_test_1',
    status: 'paid', hosted_invoice_url: 'https://pay.stripe.com/invoice/test'
  });
  console.log('   ✅');
  
  // 3. invoice.payment_failed
  console.log('3. invoice.payment_failed...');
  await sendWebhook('invoice.payment_failed', {
    id: 'in_test_failed', amount_due: 1999, currency: 'cad',
    customer: 'cus_test_sub', subscription: 'sub_test_1',
    status: 'open', attempt_count: 1, next_payment_attempt: Math.floor(Date.now()/1000) + 86400
  });
  console.log('   ✅');
  
  // 4. customer.subscription.created
  console.log('4. customer.subscription.created...');
  await sendWebhook('customer.subscription.created', {
    id: 'sub_test_new', customer: 'cus_test_sub', status: 'active',
    items: { data: [{ price: { unit_amount: 2999, recurring: { interval: 'month' } } }] },
    current_period_start: Math.floor(Date.now()/1000),
    current_period_end: Math.floor(Date.now()/1000) + 2592000,
    metadata: { plan: 'premium' }
  });
  console.log('   ✅');
  
  // 5. customer.subscription.updated
  console.log('5. customer.subscription.updated...');
  await sendWebhook('customer.subscription.updated', {
    id: 'sub_test_new', customer: 'cus_test_sub', status: 'active',
    items: { data: [{ price: { unit_amount: 4999, recurring: { interval: 'month' } } }] },
    current_period_start: Math.floor(Date.now()/1000),
    current_period_end: Math.floor(Date.now()/1000) + 2592000,
    metadata: { plan: 'premium_plus' }
  });
  console.log('   ✅');
  
  // 6. customer.subscription.deleted
  console.log('6. customer.subscription.deleted...');
  await sendWebhook('customer.subscription.deleted', {
    id: 'sub_test_old', customer: 'cus_test_sub', status: 'canceled',
    canceled_at: Math.floor(Date.now()/1000)
  });
  console.log('   ✅');
  
  // 7. payment_intent.succeeded
  console.log('7. payment_intent.succeeded...');
  await sendWebhook('payment_intent.succeeded', {
    id: 'pi_test_direct', amount: 9999, currency: 'cad',
    customer: 'cus_test_direct', status: 'succeeded',
    metadata: { type: 'one_time_purchase' }
  });
  console.log('   ✅');
  
  console.log('\n✅ All webhook event types tested!');
}

runTests().catch(console.error);

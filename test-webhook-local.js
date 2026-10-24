import Stripe from 'stripe';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Create a mock checkout.session.completed event
const mockEvent = {
  id: 'evt_test_' + Date.now(),
  object: 'event',
  api_version: '2024-06-20',
  created: Math.floor(Date.now() / 1000),
  data: {
    object: {
      id: 'cs_test_' + Date.now(),
      object: 'checkout.session',
      amount_total: 2999, // $29.99
      currency: 'cad',
      customer: 'cus_test_' + Date.now(),
      customer_email: 'test@example.com',
      mode: 'payment',
      payment_status: 'paid',
      payment_intent: 'pi_test_' + Date.now(),
      metadata: {
        product_id: 'prod_test_1',
        source: 'aura_digital_store'
      },
      line_items: {
        data: [{
          price: { unit_amount: 2999, currency: 'cad' },
          quantity: 1
        }]
      }
    }
  },
  livemode: false,
  pending_webhooks: 1,
  request: { id: null, idempotency_key: null },
  type: 'checkout.session.completed'
};

// Sign the payload
const payload = JSON.stringify(mockEvent);
const timestamp = Math.floor(Date.now() / 1000);
const signedPayload = `${timestamp}.${payload}`;
const signature = crypto
  .createHmac('sha256', webhookSecret)
  .update(signedPayload)
  .digest('hex');
const stripeSignature = `t=${timestamp},v1=${signature}`;

console.log('Sending test webhook to local server...');

fetch('http://localhost:3008/api/stripe/webhook', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Stripe-Signature': stripeSignature
  },
  body: payload
})
.then(res => res.json())
.then(data => {
  console.log('Response:', data);
})
.catch(err => {
  console.error('Error:', err.message);
});

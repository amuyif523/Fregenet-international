import Stripe from 'stripe';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { getStripeEnv } from '@/lib/env';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const { stripeSecretKey, stripeWebhookSecret } = getStripeEnv();

  if (!stripeSecretKey || !stripeWebhookSecret) {
    return new Response('Stripe webhook is not configured', { status: 500 });
  }

  const stripe = new Stripe(stripeSecretKey);
  const signature = (await headers()).get('stripe-signature');

  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 });
  }

  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, stripeWebhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid webhook signature';
    return new Response(message, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    await prisma.donation.updateMany({
      where: { stripeSessionId: session.id },
      data: {
        status: 'completed',
        donorEmail: session.customer_details?.email?.toLowerCase() || undefined,
      },
    });
  }

  return new Response('ok', { status: 200 });
}

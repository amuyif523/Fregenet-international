import Stripe from 'stripe';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { getStripeEnv } from '@/lib/env';

export const runtime = 'nodejs';

function parseSessionAmount(session: Stripe.Checkout.Session): number | null {
  if (typeof session.amount_total === 'number') {
    return session.amount_total / 100;
  }

  const amountInCents = Number.parseInt(session.metadata?.amountInCents ?? '', 10);
  return Number.isFinite(amountInCents) ? amountInCents / 100 : null;
}

async function syncDonationStatusFromSession(
  session: Stripe.Checkout.Session,
  status: string
): Promise<void> {
  if (!session.id) return;

  const donorEmail =
    session.customer_details?.email?.toLowerCase() ||
    session.customer_email?.toLowerCase() ||
    session.metadata?.donorEmail?.toLowerCase();

  const amount = parseSessionAmount(session);
  const updateData: { status: string; donorEmail?: string } = { status };

  if (donorEmail) {
    updateData.donorEmail = donorEmail;
  }

  const updated = await prisma.donation.updateMany({
    where: { stripeSessionId: session.id },
    data: updateData,
  });

  if (updated.count > 0) return;

  if (!donorEmail || amount === null) return;

  try {
    await prisma.donation.create({
      data: {
        amount,
        currency: (session.currency ?? 'usd').toUpperCase(),
        status,
        donorEmail,
        stripeSessionId: session.id,
      },
    });
  } catch {
    // Ignore races where the row is created after updateMany but before create.
  }
}

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

  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    const session = event.data.object as Stripe.Checkout.Session;
    await syncDonationStatusFromSession(session, 'completed');
  }

  if (event.type === 'checkout.session.expired' || event.type === 'checkout.session.async_payment_failed') {
    const session = event.data.object as Stripe.Checkout.Session;
    await syncDonationStatusFromSession(session, 'failed');
  }

  return new Response('ok', { status: 200 });
}

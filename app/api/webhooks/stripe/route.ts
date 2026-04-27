import { NextResponse } from "next/server";
import { stripe, priceIdToPlan } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const body      = await request.text();
  const signature = request.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub        = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        const priceId    = sub.items.data[0]?.price.id ?? "";
        const plan       = priceIdToPlan(priceId);
        const endAt      = sub.current_period_end
          ? new Date(sub.current_period_end * 1000)
          : null;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (prisma.user.updateMany as any)({
          where: { stripeCustomerId: customerId },
          data:  {
            plan,
            stripeSubscriptionId: sub.id,
            stripePriceId:        priceId,
            subscriptionStatus:   sub.status,
            subscriptionEnd:      endAt,
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const sub        = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (prisma.user.updateMany as any)({
          where: { stripeCustomerId: customerId },
          data:  {
            plan:                 "free",
            stripeSubscriptionId: null,
            stripePriceId:        null,
            subscriptionStatus:   "canceled",
            subscriptionEnd:      null,
          },
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice    = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (prisma.user.updateMany as any)({
          where: { stripeCustomerId: customerId },
          data:  { subscriptionStatus: "past_due" },
        });
        break;
      }
    }
  } catch (err) {
    console.error("[stripe webhook]", err);
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

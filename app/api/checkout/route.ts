import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { stripe, PLAN_PRICES } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { plan } = await request.json() as { plan: "pro" | "premium" };
  const priceId = PLAN_PRICES[plan];
  if (!priceId) {
    return NextResponse.json({ error: "Plan invalide" }, { status: 400 });
  }

  const userId = (session.user as { id: string }).id;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = await prisma.user.findUnique({ where: { id: userId } }) as any;
  if (!user) return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });

  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  // Existing subscriber → billing portal to upgrade/manage
  if (user.stripeSubscriptionId && user.stripeCustomerId) {
    const portal = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${base}/billing`,
    });
    return NextResponse.json({ url: portal.url });
  }

  // Get or create Stripe customer
  let customerId: string = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name:  user.name ?? undefined,
      metadata: { userId },
    });
    customerId = customer.id;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (prisma.user.update as any)({
      where: { id: userId },
      data:  { stripeCustomerId: customerId },
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer:             customerId,
    payment_method_types: ["card"],
    line_items:           [{ price: priceId, quantity: 1 }],
    mode:                 "subscription",
    success_url:          `${base}/billing?success=true`,
    cancel_url:           `${base}/pricing?canceled=true`,
    metadata:             { userId },
    subscription_data:    { metadata: { userId } },
    locale:               "fr",
  });

  return NextResponse.json({ url: checkoutSession.url });
}

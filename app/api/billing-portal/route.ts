import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = await prisma.user.findUnique({ where: { id: userId } }) as any;
  if (!user?.stripeCustomerId) {
    return NextResponse.json({ error: "Aucun abonnement actif" }, { status: 400 });
  }

  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const portal = await stripe.billingPortal.sessions.create({
    customer:   user.stripeCustomerId,
    return_url: `${base}/billing`,
  });

  return NextResponse.json({ url: portal.url });
}

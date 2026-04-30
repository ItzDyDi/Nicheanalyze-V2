import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export async function GET() {
  const testimonials = await (prisma as any).testimonial.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return Response.json(testimonials);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Connexion requise pour poster un témoignage" }, { status: 401 });
  }

  // 3 témoignages max par utilisateur par jour
  const userId = (session.user as { id: string }).id;
  const { allowed, resetAt } = checkRateLimit(`testimonial:${userId}`, 3, 24 * 60 * 60 * 1000);
  if (!allowed) return rateLimitResponse(resetAt, "Tu as déjà posté 3 témoignages aujourd'hui.");

  const { quote, name, niche, stars } = await req.json();

  if (!quote?.trim() || !name?.trim())
    return Response.json({ error: "Quote et nom requis" }, { status: 400 });

  if (quote.trim().length < 20)
    return Response.json({ error: "Témoignage trop court (min 20 caractères)" }, { status: 400 });

  if (quote.trim().length > 300)
    return Response.json({ error: "Témoignage trop long (max 300 caractères)" }, { status: 400 });

  if (name.trim().length > 50)
    return Response.json({ error: "Nom trop long (max 50 caractères)" }, { status: 400 });

  const testimonial = await (prisma as any).testimonial.create({
    data: {
      quote: quote.trim(),
      name:  name.trim(),
      niche: niche?.trim() || "🎯 Créateur",
      stars: Math.min(5, Math.max(1, Number(stars) || 5)),
    },
  });

  return Response.json(testimonial, { status: 201 });
}

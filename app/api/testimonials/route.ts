import { prisma } from "@/lib/prisma";

export async function GET() {
  const testimonials = await (prisma as any).testimonial.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return Response.json(testimonials);
}

export async function POST(req: Request) {
  const { quote, name, niche, stars } = await req.json();

  if (!quote?.trim() || !name?.trim())
    return Response.json({ error: "Quote et nom requis" }, { status: 400 });

  if (quote.trim().length < 20)
    return Response.json({ error: "Témoignage trop court (min 20 caractères)" }, { status: 400 });

  const testimonial = await (prisma as any).testimonial.create({
    data: {
      quote: quote.trim(),
      name: name.trim(),
      niche: niche?.trim() || "🎯 Créateur",
      stars: Math.min(5, Math.max(1, Number(stars) || 5)),
    },
  });

  return Response.json(testimonial, { status: 201 });
}

import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

export async function POST(req: Request) {
  // 5 inscriptions max par IP par heure
  const ip = getClientIp(req);
  const { allowed, resetAt } = checkRateLimit(`signup:${ip}`, 5, 60 * 60 * 1000);
  if (!allowed) return rateLimitResponse(resetAt, "Trop d'inscriptions depuis cette adresse. Réessaie dans 1h.");

  try {
    const { email, password, name } = await req.json();

    if (!email || !password)
      return Response.json({ error: "Email et mot de passe requis" }, { status: 400 });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return Response.json({ error: "Email invalide" }, { status: 400 });

    if (password.length < 8)
      return Response.json({ error: "Mot de passe trop court (min 8 caractères)" }, { status: 400 });

    if (password.length > 128)
      return Response.json({ error: "Mot de passe trop long" }, { status: 400 });

    if (typeof name === "string" && name.length > 50)
      return Response.json({ error: "Nom trop long (max 50 caractères)" }, { status: 400 });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return Response.json({ error: "Email déjà utilisé" }, { status: 409 });

    const hashed = await hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, name: name?.trim() || null },
    });

    return Response.json({ success: true, userId: user.id });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

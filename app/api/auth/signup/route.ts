import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password)
      return Response.json({ error: "Email et mot de passe requis" }, { status: 400 });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return Response.json({ error: "Email invalide" }, { status: 400 });

    if (password.length < 8)
      return Response.json({ error: "Mot de passe trop court (min 8 caractères)" }, { status: 400 });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return Response.json({ error: "Email déjà utilisé" }, { status: 409 });

    const hashed = await hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, name: name || null },
    });

    return Response.json({ success: true, userId: user.id });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

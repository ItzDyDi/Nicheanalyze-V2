import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Non authentifié" }, { status: 401 });

  const { name } = await req.json();
  if (!name?.trim()) return Response.json({ error: "Nom requis" }, { status: 400 });
  if (name.trim().length > 50) return Response.json({ error: "Nom trop long (max 50 car.)" }, { status: 400 });

  const userId = (session.user as { id: string }).id;
  await (prisma.user.update as any)({ where: { id: userId }, data: { name: name.trim() } });

  return Response.json({ success: true, name: name.trim() });
}

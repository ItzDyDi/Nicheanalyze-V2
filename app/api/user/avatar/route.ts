import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!session?.user || !userId) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("avatar") as File | null;

  if (!file) return Response.json({ error: "Aucun fichier" }, { status: 400 });
  if (!file.type.startsWith("image/"))
    return Response.json({ error: "Fichier invalide (image uniquement)" }, { status: 400 });
  if (file.size > 500 * 1024)
    return Response.json({ error: "Fichier trop grand (max 500KB)" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const dataUrl = `data:${file.type};base64,${Buffer.from(bytes).toString("base64")}`;

  await prisma.user.update({ where: { id: userId }, data: { image: dataUrl } });

  return Response.json({ imageUrl: dataUrl });
}

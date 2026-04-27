import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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
  if (file.size > 3 * 1024 * 1024)
    return Response.json({ error: "Fichier trop grand (max 3MB)" }, { status: 400 });

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const filename = `${userId}.${ext}`;
  const dir = path.join(process.cwd(), "public", "avatars");
  await mkdir(dir, { recursive: true });
  const filepath = path.join(dir, filename);

  const bytes = await file.arrayBuffer();
  await writeFile(filepath, Buffer.from(bytes));

  const imageUrl = `/avatars/${filename}`;
  await prisma.user.update({ where: { id: userId }, data: { image: imageUrl } });

  return Response.json({ imageUrl });
}

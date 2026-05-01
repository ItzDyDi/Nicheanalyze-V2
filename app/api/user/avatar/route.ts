import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!session?.user || !userId) {
    return new Response("Non autorisé", { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { image: true } });
  const dataUrl = user?.image;

  if (!dataUrl || !dataUrl.startsWith("data:")) {
    return new Response("Not found", { status: 404 });
  }

  const [meta, b64] = dataUrl.split(",");
  const mimeMatch = meta.match(/data:([^;]+)/);
  const mime = mimeMatch?.[1] ?? "image/jpeg";
  const buffer = Buffer.from(b64, "base64");

  return new Response(buffer, {
    headers: {
      "Content-Type": mime,
      "Cache-Control": "private, max-age=60",
    },
  });
}

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

  // Return a small URL instead of the full base64 so the JWT cookie stays small
  return Response.json({ imageUrl: `/api/user/avatar?v=${Date.now()}` });
}

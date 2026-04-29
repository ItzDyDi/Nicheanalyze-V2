import { auth } from "@/auth";
import { PLANS } from "@/lib/plan-limits";
import type { ExportData } from "@/types";

function escapeCsv(value: unknown): string {
  const str = String(value ?? "");
  // Prevent formula injection (Excel/Sheets execute cells starting with =+-@)
  const safe = /^[=+\-@\t\r]/.test(str) ? "'" + str : str;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Connexion requise" }, { status: 401 });
  }

  const plan = ((session.user as { plan?: string }).plan ?? "free") as "free" | "pro" | "premium";
  if (!PLANS[plan].exportCsv) {
    return Response.json({ error: "Export CSV disponible à partir du plan Pro" }, { status: 403 });
  }

  const body: { query: string; results: ExportData["topVideos"]; format: "csv" | "pdf" } =
    await request.json();

  if (!Array.isArray(body.results) || body.results.length > 200) {
    return Response.json({ error: "Données invalides" }, { status: 400 });
  }

  if (body.format === "csv") {
    const header = "rank,views,likes,duration,hook,creator\n";
    const rows = body.results
      .map((v, i) =>
        [i + 1, v.views, v.likes, v.duration, escapeCsv(v.hook), escapeCsv(v.creatorHandle)].join(",")
      )
      .join("\n");

    const safeQuery = (body.query ?? "export").replace(/[^a-z0-9_-]/gi, "_").slice(0, 50);

    return new Response(header + rows, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="tiktok-analysis-${safeQuery}.csv"`,
      },
    });
  }

  return Response.json({ success: false, error: "Format non supporté" }, { status: 400 });
}

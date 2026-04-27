import type { ExportData } from "@/types";

export async function POST(request: Request) {
  const body: { query: string; results: ExportData["topVideos"]; format: "csv" | "pdf" } =
    await request.json();

  if (body.format === "csv") {
    const header = "rank,views,likes,duration,hook,creator\n";
    const rows = body.results
      .map((v, i) =>
        [i + 1, v.views, v.likes, v.duration, `"${v.hook}"`, v.creatorHandle].join(",")
      )
      .join("\n");

    return new Response(header + rows, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="tiktok-analysis-${body.query}.csv"`,
      },
    });
  }

  return Response.json({ success: false, error: "Format non supporté" }, { status: 400 });
}

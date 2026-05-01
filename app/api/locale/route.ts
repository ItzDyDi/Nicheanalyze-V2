import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
  const country =
    req.headers.get("cf-ipcountry") ||
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("x-country") ||
    "US";

  return NextResponse.json({ lang: country === "FR" ? "fr" : "en" });
}

import { NextResponse } from "next/server";
import { getComprehensiveSummary } from "@/lib/db-service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId") || "all";
    const dateStr = searchParams.get("date") || undefined;

    const summary = await getComprehensiveSummary({
      businessId,
      dateStr,
    });

    return NextResponse.json(summary);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to get summary" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getBusinessStats } from "@/lib/db-service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");
    if (!businessId) {
      return NextResponse.json({ error: "businessId parameter is required" }, { status: 400 });
    }

    const period = (searchParams.get("period") as any) || "month";
    const stats = await getBusinessStats(businessId, period);
    return NextResponse.json(stats);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


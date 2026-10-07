import { NextResponse } from "next/server";
import { getKhataParties, createKhataParty } from "@/lib/db-service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");
    if (!businessId) {
      return NextResponse.json({ error: "businessId parameter is required" }, { status: 400 });
    }

    const parties = await getKhataParties(businessId);
    return NextResponse.json(parties);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.businessId || !data.name) {
      return NextResponse.json({ error: "businessId and name are required" }, { status: 400 });
    }

    const party = await createKhataParty({
      businessId: data.businessId,
      name: data.name.trim(),
      phone: data.phone,
      notes: data.notes,
    });
    return NextResponse.json(party, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


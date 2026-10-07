import { NextResponse } from "next/server";
import { addKhataEntry } from "@/lib/db-service";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.partyId || !data.type || !data.amount) {
      return NextResponse.json(
        { error: "Missing required fields (partyId, type, amount)" },
        { status: 400 }
      );
    }

    const entry = await addKhataEntry({
      partyId: data.partyId,
      type: data.type, // "GAVE" or "GOT"
      amount: Number(data.amount),
      description: data.description,
      paymentMode: data.paymentMode || "CASH",
      date: data.date,
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


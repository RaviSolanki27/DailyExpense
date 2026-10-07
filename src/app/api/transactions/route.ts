import { NextResponse } from "next/server";
import { getTransactions, createTransaction } from "@/lib/db-service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");
    if (!businessId) {
      return NextResponse.json({ error: "businessId parameter is required" }, { status: 400 });
    }

    const type = searchParams.get("type") || undefined;
    const paymentMode = searchParams.get("paymentMode") || undefined;
    const period = searchParams.get("period") || undefined;
    const search = searchParams.get("search") || undefined;
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;

    const transactions = await getTransactions(businessId, {
      type,
      paymentMode,
      period,
      search,
      startDate,
      endDate,
    });

    return NextResponse.json(transactions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.businessId || !data.amount || !data.title || !data.type) {
      return NextResponse.json(
        { error: "Missing required fields (businessId, type, amount, title)" },
        { status: 400 }
      );
    }

    const created = await createTransaction({
      businessId: data.businessId,
      type: data.type, // "INCOME" or "EXPENSE"
      amount: Number(data.amount),
      title: data.title.trim(),
      paymentMode: data.paymentMode || "CASH", // "ONLINE" | "CASH" | "OTHER"
      date: data.date,
      note: data.note,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


import { NextResponse } from "next/server";
import { getBusinesses, createBusiness } from "@/lib/db-service";

export async function GET() {
  try {
    const list = await getBusinesses();
    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.name || !data.name.trim()) {
      return NextResponse.json({ error: "Business name is required" }, { status: 400 });
    }
    const created = await createBusiness({
      name: data.name.trim(),
      category: data.category,
      description: data.description,
      currency: data.currency || "₹",
      color: data.color || "emerald",
      icon: data.icon || "briefcase",
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


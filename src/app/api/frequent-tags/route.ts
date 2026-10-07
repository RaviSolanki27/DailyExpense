import { NextResponse } from "next/server";
import { getFrequentTags, addOrIncrementFrequentTag, deleteFrequentTag } from "@/lib/db-service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");
    if (!businessId) {
      return NextResponse.json({ error: "businessId parameter is required" }, { status: 400 });
    }

    const tags = await getFrequentTags(businessId);
    return NextResponse.json(tags);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { businessId, label } = await request.json();
    if (!businessId || !label) {
      return NextResponse.json({ error: "businessId and label are required" }, { status: 400 });
    }

    const tag = await addOrIncrementFrequentTag(businessId, label);
    return NextResponse.json(tag, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id parameter is required" }, { status: 400 });
    }

    await deleteFrequentTag(id);
    return NextResponse.json({ success: true, message: "Tag deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


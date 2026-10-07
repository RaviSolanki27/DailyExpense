import { NextResponse } from "next/server";
import { getKhataParty, updateKhataParty, deleteKhataParty } from "@/lib/db-service";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const party = await getKhataParty(id);
    if (!party) {
      return NextResponse.json({ error: "Party not found" }, { status: 404 });
    }
    return NextResponse.json(party);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const data = await request.json();
    const updated = await updateKhataParty(id, data);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await deleteKhataParty(id);
    return NextResponse.json({ success: true, message: "Party deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


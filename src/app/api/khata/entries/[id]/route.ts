import { NextResponse } from "next/server";
import { deleteKhataEntry } from "@/lib/db-service";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await deleteKhataEntry(id);
    return NextResponse.json({ success: true, message: "Khata entry deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


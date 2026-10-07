import { NextResponse } from "next/server";
import { getPasscode, setPasscode, verifyPasscode } from "@/lib/db-service";

export async function GET() {
  try {
    const code = await getPasscode();
    // Return whether passcode exists and if it's currently default '0000'
    return NextResponse.json({
      hasPasscode: true,
      isDefault: code === "0000",
    });
  } catch (error) {
    return NextResponse.json({ hasPasscode: true, isDefault: true }, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const { passcode } = await request.json();
    if (!passcode || typeof passcode !== "string") {
      return NextResponse.json({ error: "Invalid passcode format" }, { status: 400 });
    }

    const isValid = await verifyPasscode(passcode);
    if (isValid) {
      return NextResponse.json({ success: true, message: "Unlocked successfully" });
    } else {
      return NextResponse.json({ success: false, error: "Incorrect 4-digit passcode" }, { status: 401 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to verify" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { currentPasscode, newPasscode } = await request.json();
    if (!newPasscode || newPasscode.length !== 4) {
      return NextResponse.json({ error: "New passcode must be 4 digits" }, { status: 400 });
    }

    const isValid = await verifyPasscode(currentPasscode);
    if (!isValid) {
      return NextResponse.json({ error: "Current passcode is incorrect" }, { status: 401 });
    }

    await setPasscode(newPasscode);
    return NextResponse.json({ success: true, message: "Passcode updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update" }, { status: 500 });
  }
}


import { NextResponse } from "next/server";
import { checkDbConnection } from "@/lib/db-service";

export async function GET() {
  const isConnected = await checkDbConnection();
  return NextResponse.json({
    database: isConnected ? "connected" : "fallback_mode",
    provider: "PostgreSQL (NeonDB)",
    message: isConnected
      ? "Successfully connected to PostgreSQL (NeonDB)"
      : "Running in local storage fallback mode. Add your NeonDB URL to DATABASE_URL in .env to connect.",
  });
}


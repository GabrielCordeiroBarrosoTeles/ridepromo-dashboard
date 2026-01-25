import { NextResponse } from "next/server";
import { fetchTripById, fetchDriverRateConfig } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tripId = parseInt(id, 10);
    if (Number.isNaN(tripId) || tripId < 1) {
      return NextResponse.json({ error: "Invalid trip id" }, { status: 400 });
    }
    const [trip, driverRateConfig] = await Promise.all([
      fetchTripById(tripId),
      fetchDriverRateConfig(),
    ]);
    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }
    return NextResponse.json({ trip, driverRateConfig });
  } catch (e) {
    console.error("[GET /api/trips/[id]]", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

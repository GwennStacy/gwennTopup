import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Package from "@/models/Package";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get("gameId");

    await connectToDatabase();
    
    let query = {};
    if (gameId) {
      query = { game_id: gameId };
    }

    const packages = await Package.find(query).sort({ sort_order: 1, price: 1 });
    return NextResponse.json(packages);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectToDatabase();
    const newPackage = await Package.create(body);
    return NextResponse.json(newPackage, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create package" }, { status: 500 });
  }
}

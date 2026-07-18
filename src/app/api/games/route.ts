import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Game from "@/models/Game";

export async function GET() {
  try {
    await connectToDatabase();
    // Return games that are marked active, formatted to match the frontend expectations
    // The frontend expects: { id: string, name: string, image: string, publisher: string, requiresZoneId: boolean, g2bulkCode: string }
    const games = await Game.find({ active: true }).sort({ name: 1 });
    
    const formattedGames = games.map(g => ({
      id: g.id_string,
      name: g.name,
      image: g.image_url || "/game/default.jpg", // fallback
      publisher: g.publisher,
      requiresZoneId: g.requires_zone_id,
      g2bulkCode: g.id_string
    }));

    return NextResponse.json(formattedGames);
  } catch (error: any) {
    console.error("Fetch games error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

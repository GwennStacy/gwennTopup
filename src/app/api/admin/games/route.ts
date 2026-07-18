import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Game from "@/models/Game";

export async function POST(req: Request) {
  try {
    const { games } = await req.json();
    
    if (!games || !Array.isArray(games)) {
      return NextResponse.json({ success: false, error: "Invalid games payload" }, { status: 400 });
    }

    await connectToDatabase();

    let added = 0;

    for (const game of games) {
      await Game.findOneAndUpdate(
        { id_string: game.code || game.id_string },
        {
          id_string: game.code || game.id_string,
          name: game.name,
          publisher: game.publisher || "G2Bulk",
          image_url: game.image_url,
          requires_zone_id: game.requires_zone_id !== undefined ? game.requires_zone_id : true,
          active: true,
        },
        { upsert: true, new: true }
      );
      added++;
    }

    return NextResponse.json({ success: true, message: `Successfully added/updated ${added} games!` });
  } catch (error: any) {
    console.error("Save Games Error:", error);
    return NextResponse.json({ success: false, error: error.message || "An error occurred" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const games = await Game.find().sort({ createdAt: -1 });
    return NextResponse.json(games);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

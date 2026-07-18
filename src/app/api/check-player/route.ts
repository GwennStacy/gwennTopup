import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { gameId, userId, zoneId } = await request.json();

    const PROVIDER_API_URL = "https://api.g2bulk.com/v1/games/checkPlayerId";

    // Actual API Call to Provider
    const response = await fetch(PROVIDER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        game: gameId,
        user_id: userId,
        server_id: zoneId || "",
      }),
    });

    const data = await response.json();

    if (data.valid === "valid") {
      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        { error: "Invalid Player ID or Zone ID." },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Player ID Check Error:", error);
    return NextResponse.json(
      { error: "Failed to verify ID" },
      { status: 500 }
    );
  }
}

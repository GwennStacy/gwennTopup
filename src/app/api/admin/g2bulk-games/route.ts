import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://api.g2bulk.com/v1/games", {
      next: { revalidate: 3600 }
    });
    const data = await res.json();
    
    if (data.error) {
      return NextResponse.json({ success: false, error: data.error }, { status: 400 });
    }

    if (!data.games || !Array.isArray(data.games)) {
      return NextResponse.json({ success: false, error: "Invalid response format from G2Bulk" }, { status: 500 });
    }

    return NextResponse.json({ success: true, games: data.games });
  } catch (error: any) {
    console.error("G2Bulk Games Error:", error);
    return NextResponse.json({ success: false, error: error.message || "An error occurred fetching games" }, { status: 500 });
  }
}

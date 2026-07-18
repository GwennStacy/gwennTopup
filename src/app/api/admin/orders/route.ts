import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import "@/models/Game"; // Ensure model is registered
import "@/models/Package"; // Ensure model is registered

export async function GET() {
  try {
    await connectToDatabase();
    
    const orders = await Order.find()
      .populate("game_id", "name image_url")
      .populate("package_id", "name price diamonds")
      .sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("Fetch Orders Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch orders" }, { status: 500 });
  }
}

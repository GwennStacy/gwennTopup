import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import Package from "@/models/Package";
import Game from "@/models/Game";

import crypto from "crypto";
import { rateLimit } from "@/lib/rateLimit";
import { z } from "zod";

const createOrderSchema = z.object({
  gameId: z.string().min(1, "Game ID is required"),
  packageId: z.string().min(1, "Package ID is required"),
  userId: z.string().min(1, "User ID is required").max(100, "User ID is too long"),
  zoneId: z.string().optional(),
  paymentMethod: z.string().min(1, "Payment method is required"),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateLimitResult = rateLimit(ip, 5, 60000); // 5 requests per 60 seconds

    if (!rateLimitResult.success) {
      return NextResponse.json({ error: "Too many requests, please try again later." }, { status: 429 });
    }

    await connectToDatabase();
    
    const body = await req.json();
    const validation = createOrderSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid input", details: validation.error.format() }, { status: 400 });
    }
    
    const { gameId, packageId, userId, zoneId, paymentMethod } = validation.data;
    
    // Fetch package to get the exact total price
    const pkg = await Package.findById(packageId);
    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }
    
    // Generate unique order ID (e.g. GWN-12345678)
    const orderId = `GWN-${Math.floor(10000000 + Math.random() * 90000000)}`;
    
    // Find the actual internal Game object ID based on the API code
    const game = await Game.findOne({ id_string: gameId });
    if (!game) {
      return NextResponse.json({ error: "Game not found in database" }, { status: 404 });
    }

    let checkout_url = "";

    // Generate ABA KHQR via KhqrPay
    if (paymentMethod === "aba") {
      const protocol = req.headers.get("x-forwarded-proto") || "http";
      const host = req.headers.get("host") || "localhost:3000";
      const webhook_url = `${protocol}://${host}/api/webhooks/khqr`;
      
      const secret = (process.env.KHQRPAY_SECRET || "5DZq745PvGy1h1bzISImPC7PQMHPHzkX").trim();
      const profile = (process.env.KHQRPAY_PROFILE || "5naBW0cACcdMewjeavsGmbvR9Fvv0PAz").trim();
      
      const gatewayUrl = `https://khqr.cc/api/payment/requestv2`;

      const amount = pkg.price.toFixed(2);
      // Remove any non-alphanumeric characters from remark to prevent hash mismatches
      const safeRemark = `Topup ${game.name} - ${userId}`.replace(/[^a-zA-Z0-9 -]/g, '').trim().replace(/\s+/g, ' ');
      const remark = safeRemark.substring(0, 50).trim(); // KhqrPay remark limit and trim trailing spaces
      
      const hashString = secret + orderId + amount + webhook_url + remark;
      const hash = crypto.createHash("sha1").update(hashString).digest("hex");
      
      const params = new URLSearchParams({
        transaction_id: orderId,
        amount: amount,
        success_url: webhook_url,
        remark: remark,
        hash: hash
      });

      checkout_url = `${gatewayUrl}/${profile}?${params.toString()}`;
    }

    const originalPrice = pkg.original_price || 0;
    const profit = parseFloat((pkg.price - originalPrice).toFixed(2));

    // Create new order in MongoDB
    const newOrder = new Order({
      order_id: orderId,
      game_id: game._id,
      package_id: pkg._id,
      user_id: userId,
      zone_id: zoneId || "",
      payment_method: paymentMethod,
      total_price: pkg.price,
      original_price: originalPrice,
      profit: profit,
      status: "pending",
      khqr_string: "",
      khqr_url: "",
      checkout_url: checkout_url,
    });
    
    await newOrder.save();
    
    return NextResponse.json({ 
      success: true, 
      order_id: orderId,
      checkout_url: checkout_url,
      total_price: pkg.price
    });
  } catch (error: any) {
    console.error("Order Creation Error:", error);
    return NextResponse.json({ error: "Failed to create order", details: error?.message || String(error) }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import Package from "@/models/Package";
import Game from "@/models/Game";

import crypto from "crypto";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    const { gameId, packageId, userId, zoneId, paymentMethod } = body;
    
    if (!gameId || !packageId || !userId || !paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
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

    let khqr_string = "";
    let khqr_url = "";

    // Generate ABA KHQR via KhqrPay
    if (paymentMethod === "aba") {
      const protocol = req.headers.get("x-forwarded-proto") || "http";
      const host = req.headers.get("host") || "localhost:3000";
      const webhook_url = `${protocol}://${host}/api/webhooks/khqr`;
      
      const secret = (process.env.KHQRPAY_SECRET || "5DZq745PvGy1h1bzISImPC7PQMHPHzkX").trim();
      const profile = (process.env.KHQRPAY_PROFILE || "5naBW0cACcdMewjeavsGmbvR9Fvv0PAz").trim();
      
      const khqrApiUrl = `https://khqr.cc/api/${profile}/payment-gateway/v1/payments/qr-api-khqrcc`;

      const amount = pkg.price.toFixed(2);
      // Remove any non-alphanumeric characters from remark to prevent hash mismatches
      const safeRemark = `Topup ${game.name} - ${userId}`.replace(/[^a-zA-Z0-9 -]/g, '').trim().replace(/\s+/g, ' ');
      const remark = safeRemark.substring(0, 50).trim(); // KhqrPay remark limit and trim trailing spaces
      
      const hashString = secret + orderId + amount + webhook_url + remark;
      const hash = crypto.createHash("sha1").update(hashString).digest("hex");
      
      console.log("KhqrPay Debug:", {
        secret: secret.substring(0, 5) + '...',
        orderId,
        amount,
        webhook_url,
        remark,
        hashString,
        hash
      });

      const params = new URLSearchParams({
        transaction_id: orderId,
        amount: amount,
        success_url: webhook_url,
        remark: remark,
        hash: hash
      });

      const response = await fetch(khqrApiUrl, {
        method: "POST",
        headers: { 
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        },
        body: params.toString(),
        cache: "no-store",
      });

      const responseText = await response.text();
      console.log("KhqrPay URL:", khqrApiUrl);
      console.log("KhqrPay Response:", responseText.substring(0, 500));
      const data = JSON.parse(responseText);
      
      if (data.responseCode === 0 && data.data) {
        khqr_string = data.data.qr;
        khqr_url = data.data.qr_url;
      } else {
        console.error("KhqrPay API Error:", data);
        return NextResponse.json({ error: "Payment gateway error. Please try again." }, { status: 500 });
      }
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
      khqr_string: khqr_string,
      khqr_url: khqr_url,
    });
    
    await newOrder.save();
    
    return NextResponse.json({ 
      success: true, 
      order_id: orderId,
      khqr_string: khqr_string,
      total_price: pkg.price
    });
  } catch (error: any) {
    console.error("Order Creation Error:", error);
    return NextResponse.json({ error: "Failed to create order", details: error?.message || String(error) }, { status: 500 });
  }
}

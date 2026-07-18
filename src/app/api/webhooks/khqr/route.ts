import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import "@/models/Package"; // ensure Package model is loaded for populate
import { sendTelegramMessage } from "@/lib/telegram";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    let body: any = {};
    
    // Attempt to parse as JSON first, fallback to URLSearchParams
    try {
      body = JSON.parse(rawBody);
    } catch {
      const params = new URLSearchParams(rawBody);
      body = Object.fromEntries(params.entries());
    }

    // Typical KhqrPay callbacks include transaction_id, order_id, or tran_id
    const transactionId = body.transaction_id || body.order_id || body.tran_id;
    
    console.log("KhqrPay Webhook received payload:", body);

    if (!transactionId) {
       console.error("Missing transaction_id in webhook payload");
       return NextResponse.json({ success: false, error: "Missing transaction_id" }, { status: 400 });
    }

    await connectToDatabase();

    const order = await Order.findOne({ order_id: transactionId }).populate("package_id");

    if (!order) {
      console.error(`Order not found for transaction_id: ${transactionId}`);
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    if (order.status === "success") {
      return NextResponse.json({ success: true, message: "Order already fulfilled" });
    }

    // Depending on the payload from KhqrPay, you might want to verify 'status' == 'success' or '0'
    // but typically the webhook is only hit on success. 
    // We assume the payment is successful if this webhook is reached.

    // 1. Update status to processing
    order.status = "processing";
    await order.save();

    // 2. Fulfill via G2Bulk
    const apiKey = process.env.G2BULK_API_KEY;
    if (!apiKey) {
      console.error("G2BULK_API_KEY is not defined");
      order.status = "failed";
      await order.save();
      return NextResponse.json({ success: false, error: "Server configuration error" }, { status: 500 });
    }

    const pkg = order.package_id as any;
    if (!pkg || !pkg.api_product_id) {
       console.error("Package does not have an api_product_id. Cannot fulfill with G2Bulk.");
       order.status = "failed";
       await order.save();
       return NextResponse.json({ success: false, error: "Invalid package setup" }, { status: 400 });
    }

    // Format the player identity. E.g. Mobile Legends uses PlayerID|ZoneID
    const linkFormat = order.zone_id ? `${order.user_id}|${order.zone_id}` : order.user_id;

    const params = new URLSearchParams({
      key: apiKey,
      action: "add",
      service: pkg.api_product_id,
      link: linkFormat,
      quantity: "1"
    });

    console.log("Calling G2Bulk API with params:", params.toString());

    const response = await fetch("https://api.g2bulk.com/api/v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await response.json();
    console.log("G2Bulk Response:", data);

    // 3. Update Order based on G2Bulk Response
    if (data.order) {
      order.status = "success";
      await order.save();
      await sendTelegramMessage(`✅ <b>Order Successful</b>\nOrder ID: <code>${order.order_id}</code>\nGame: ${pkg.name}\nPlayer: <code>${linkFormat}</code>\nG2Bulk ID: <code>${data.order}</code>`);
      return NextResponse.json({ success: true, message: "Order fulfilled successfully", g2bulk_order_id: data.order });
    } else {
      console.error("G2Bulk Fulfillment Error:", data.error);
      order.status = "failed";
      await order.save();
      await sendTelegramMessage(`❌ <b>Order Failed</b>\nOrder ID: <code>${order.order_id}</code>\nGame: ${pkg.name}\nPlayer: <code>${linkFormat}</code>\nReason: <i>${data.error}</i>`);
      return NextResponse.json({ success: false, error: "Failed to fulfill via provider", providerError: data.error });
    }

  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

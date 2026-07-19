import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import crypto from "crypto";
import { sendTelegramMessage } from "@/lib/telegram";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    
    const resolvedParams = await params;
    const orderId = resolvedParams.id;
    
    const order = await Order.findOne({ order_id: orderId });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status === "success") {
      return NextResponse.json({ status: "success" });
    }

    // Check with KhqrPay
    if (order.payment_method === "aba") {
      const secret = process.env.KHQRPAY_SECRET || "HxqNvcunZfcVIYv3vILmnUv4uavRbCsQ";
      const profile = process.env.KHQRPAY_PROFILE || "GxEKDibOpEQnSCb6xZLac240pAk0RrYr";
      const checkUrl = `https://khqr.cc/api/${profile}/payment-gateway/v1/payments/check-transv2-khqrcc`;

      const hash = crypto.createHash("sha1").update(secret + orderId).digest("hex");

      const requestParams = new URLSearchParams({
        transaction_id: orderId,
        hash: hash
      });

      const response = await fetch(checkUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: requestParams.toString()
      });

      const data = await response.json();
      
      if (data.responseCode === 0 && data.data && data.data.status === "success") {
        if (order.status === "pending") {
           // Atomic update to prevent race conditions between webhook and polling
           const updatedOrder = await Order.findOneAndUpdate(
             { order_id: orderId, status: "pending" },
             { $set: { status: "processing" } },
             { new: true }
           ).populate("package_id");

           if (updatedOrder) {
             // We successfully claimed the fulfillment task
             try {
               const apiKey = process.env.G2BULK_API_KEY;
               if (!apiKey) throw new Error("Missing G2BULK_API_KEY");
               
               const pkg = updatedOrder.package_id as any;
               if (!pkg || !pkg.api_product_id) throw new Error("Invalid package setup");

               const linkFormat = updatedOrder.zone_id ? `${updatedOrder.user_id}|${updatedOrder.zone_id}` : updatedOrder.user_id;

               const params = new URLSearchParams({
                 key: apiKey,
                 action: "add",
                 service: pkg.api_product_id,
                 link: linkFormat,
                 quantity: "1"
               });

               const g2bRes = await fetch("https://api.g2bulk.com/api/v2", {
                 method: "POST",
                 headers: { "Content-Type": "application/x-www-form-urlencoded" },
                 body: params.toString(),
               });

               const g2bData = await g2bRes.json();
               
               if (g2bData.order) {
                 updatedOrder.status = "success";
                 await updatedOrder.save();
                 await sendTelegramMessage(`✅ <b>Order Successful (Poller)</b>\nOrder ID: <code>${updatedOrder.order_id}</code>\nGame: ${pkg.name}\nPlayer: <code>${linkFormat}</code>\nG2Bulk ID: <code>${g2bData.order}</code>`);
                 return NextResponse.json({ status: "success" });
               } else {
                 console.error("G2Bulk Polling Error:", g2bData.error);
                 updatedOrder.status = "failed";
                 await updatedOrder.save();
                 await sendTelegramMessage(`❌ <b>Order Failed (Poller)</b>\nOrder ID: <code>${updatedOrder.order_id}</code>\nGame: ${pkg.name}\nPlayer: <code>${linkFormat}</code>\nReason: <i>${g2bData.error}</i>`);
                 return NextResponse.json({ status: "failed" });
               }
             } catch (err) {
               console.error("Fulfillment Error in Polling:", err);
               updatedOrder.status = "failed";
               await updatedOrder.save();
               return NextResponse.json({ status: "failed" });
             }
           }
        }
        return NextResponse.json({ status: order.status });
      }
    }

    return NextResponse.json({ status: order.status });
  } catch (error: any) {
    console.error("Order Check Error:", error);
    return NextResponse.json({ error: "Failed to check order" }, { status: 500 });
  }
}

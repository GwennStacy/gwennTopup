import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import Package from "@/models/Package";
import Game from "@/models/Game";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Copy, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import CheckoutPoller from "@/components/CheckoutPoller";

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  
  const resolvedParams = await params;
  const order = await Order.findOne({ order_id: resolvedParams.id }).lean();
  if (!order) {
    notFound();
  }

  const pkg = await Package.findById(order.package_id).lean();
  const game = await Game.findById(order.game_id).lean();

  return (
    <main className="min-h-screen bg-[#090B12] text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-32 max-w-2xl">
        <div className="glass-card p-8 rounded-3xl border border-white/5 text-center shadow-xl shadow-black/50">
          
          <h1 className="text-2xl font-bold mb-2 text-white">Checkout Order</h1>
          <p className="text-gray-400 mb-8 font-mono">ID: {order.order_id}</p>

          <div className="bg-white/5 rounded-2xl p-6 mb-8 text-left space-y-4 border border-white/5">
            <div className="flex justify-between pb-4 border-b border-white/10">
              <span className="text-gray-400">Game</span>
              <span className="font-bold text-white">{game?.name}</span>
            </div>
            <div className="flex justify-between pb-4 border-b border-white/10">
              <span className="text-gray-400">Player ID</span>
              <span className="font-bold text-white">{order.user_id} {order.zone_id ? `(${order.zone_id})` : ""}</span>
            </div>
            <div className="flex justify-between pb-4 border-b border-white/10">
              <span className="text-gray-400">Package</span>
              <span className="font-bold text-secondary">{pkg?.name}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-gray-400 font-medium">Total Amount</span>
              <span className="text-2xl font-black text-white">${order.total_price.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-[#090B12] rounded-2xl p-10 flex flex-col items-center justify-center border border-dashed border-white/20 relative overflow-hidden min-h-[350px]">
            {/* Ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary/20 blur-[100px] rounded-full pointer-events-none"></div>
            
             {order.payment_method === "aba" && (
              <CheckoutPoller orderId={order.order_id} checkoutUrl={order.checkout_url || ""} amount={order.total_price} packageName={pkg?.name} userId={order.user_id} zoneId={order.zone_id} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import Package from "@/models/Package";
import Game from "@/models/Game";
import { Users, CreditCard, Activity, TrendingUp, Wallet, AlertTriangle } from "lucide-react";

async function fetchG2BulkBalance() {
  try {
    const apiKey = process.env.G2BULK_API_KEY;
    if (!apiKey) return null;
    
    const params = new URLSearchParams({
      key: apiKey,
      action: "balance"
    });
    
    const response = await fetch("https://api.g2bulk.com/api/v2", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("G2Bulk Balance Error:", err);
    return null;
  }
}

export default async function AdminDashboard() {
  await connectToDatabase();
  
  // Wait for all data concurrently
  const [
    g2bulkData,
    recentOrders,
    revenueData,
    activeOrdersCount,
    uniqueUsersCount
  ] = await Promise.all([
    fetchG2BulkBalance(),
    Order.find().sort({ createdAt: -1 }).limit(10).populate("package_id").populate("game_id").lean(),
    Order.aggregate([ { $match: { status: "success" } }, { $group: { _id: null, total: { $sum: "$total_price" }, profit: { $sum: "$profit" } } } ]),
    Order.countDocuments({ status: { $in: ["pending", "processing"] } }),
    Order.distinct("user_id")
  ]);

  const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;
  const totalProfit = revenueData.length > 0 ? revenueData[0].profit : 0;
  const totalCustomers = uniqueUsersCount.length;
  
  const balance = g2bulkData?.balance ? parseFloat(g2bulkData.balance) : 0;
  const isLowBalance = balance < 5;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Dashboard Overview</h2>
          <p className="text-gray-400 text-sm">Welcome back! Here is the live status of your Top-up store.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        
        {/* G2Bulk Wallet Card */}
        <div className={`p-6 rounded-3xl border relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
          isLowBalance 
            ? "bg-red-500/10 border-red-500/30 hover:shadow-red-500/20" 
            : "glass-card border-white/10 hover:shadow-primary/10"
        }`}>
          {isLowBalance && (
            <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/20 rounded-bl-full flex items-start justify-end p-3">
              <AlertTriangle size={18} className="text-red-400 animate-pulse" />
            </div>
          )}
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${isLowBalance ? "bg-red-500/20 shadow-red-500/20" : "bg-[#00E5FF]/20 shadow-[#00E5FF]/20"}`}>
              <Wallet size={24} className={isLowBalance ? "text-red-400" : "text-[#00E5FF]"} />
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1 tracking-wide">G2Bulk Wallet</p>
            <h3 className={`text-4xl font-black ${isLowBalance ? "text-red-400" : "text-white"}`}>
              ${balance.toFixed(2)}
            </h3>
            {isLowBalance && <p className="text-xs text-red-400/80 mt-2 font-medium">Low balance warning!</p>}
          </div>
        </div>

        {/* Total Revenue */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-success/10 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-success/20 shadow-lg shadow-success/20">
              <TrendingUp size={24} className="text-success" />
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1 tracking-wide">Total Revenue</p>
            <h3 className="text-4xl font-black text-white">${totalRevenue.toFixed(2)}</h3>
          </div>
        </div>

        {/* Total Profit */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-[#00E5FF]/10 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#00E5FF]/20 shadow-lg shadow-[#00E5FF]/20">
              <TrendingUp size={24} className="text-[#00E5FF]" />
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1 tracking-wide">Total Profit</p>
            <h3 className="text-4xl font-black text-white">${totalProfit.toFixed(2)}</h3>
          </div>
        </div>

        {/* Active Orders */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/20 shadow-lg shadow-primary/20">
              <Activity size={24} className="text-primary" />
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1 tracking-wide">Active Orders</p>
            <h3 className="text-4xl font-black text-white">{activeOrdersCount}</h3>
          </div>
        </div>

        {/* Total Customers */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-secondary/10 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-secondary/20 shadow-lg shadow-secondary/20">
              <Users size={24} className="text-secondary" />
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1 tracking-wide">Unique Customers</p>
            <h3 className="text-4xl font-black text-white">{totalCustomers}</h3>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="glass-card border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="p-6 border-b border-white/5 bg-white/5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CreditCard size={20} className="text-[#00E5FF]" />
            Recent Orders
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/20 text-gray-400 text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-5">Order ID</th>
                <th className="px-6 py-5">Customer</th>
                <th className="px-6 py-5">Package</th>
                <th className="px-6 py-5">Amount</th>
                <th className="px-6 py-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order: any) => (
                  <tr key={order._id.toString()} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-mono text-gray-300 font-bold group-hover:text-[#00E5FF] transition-colors">{order.order_id}</span>
                      <div className="text-[11px] text-gray-500 mt-1 font-medium">{new Date(order.createdAt).toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-semibold">{order.user_id}</div>
                      {order.zone_id && <div className="text-xs text-gray-400 font-medium">Zone: {order.zone_id}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-semibold">{order.game_id?.name || 'Unknown Game'}</div>
                      <div className="text-[11px] text-gray-400 font-medium">{order.package_id?.name || 'Unknown Package'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[#00E5FF] font-black">${order.total_price.toFixed(2)}</div>
                      <div className="text-[11px] text-gray-500 uppercase font-bold">{order.payment_method}</div>
                    </td>
                    <td className="px-6 py-4">
                      {order.status === 'success' && (
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold bg-success/10 text-success border border-success/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-success mr-2 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                          Success
                        </span>
                      )}
                      {order.status === 'pending' && (
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-2 animate-pulse shadow-[0_0_8px_rgba(234,179,8,0.8)]"></span>
                          Pending
                        </span>
                      )}
                      {order.status === 'processing' && (
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
                          Processing
                        </span>
                      )}
                      {order.status === 'failed' && (
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold bg-red-500/10 text-red-500 border border-red-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
                          Failed
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

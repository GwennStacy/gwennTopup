"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Trash2, RefreshCw } from "lucide-react";
import clsx from "clsx";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all', 'pending', 'success', 'failed'
  
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    if (!confirm(`Are you sure you want to mark this order as ${status}?`)) return;
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchOrders();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update order");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchOrders();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete order");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    }
  };

  const filteredOrders = orders.filter(order => filter === "all" || order.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Manage Orders</h2>
          <p className="text-gray-400 text-sm">View and manage customer top-up orders.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary"
          >
            <option value="all" className="bg-[#090B12]">All Orders</option>
            <option value="pending" className="bg-[#090B12]">Pending / Paid Pending</option>
            <option value="processing" className="bg-[#090B12]">Processing</option>
            <option value="success" className="bg-[#090B12]">Success</option>
            <option value="failed" className="bg-[#090B12]">Failed</option>
          </select>

          <button 
            onClick={fetchOrders}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      <div className="glass-card border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID / Date</th>
                <th className="px-6 py-4 font-medium">Player Info</th>
                <th className="px-6 py-4 font-medium">Package</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">Loading orders...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">No orders found.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{order.order_id}</div>
                      <div className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">ID: {order.user_id}</div>
                      {order.zone_id && <div className="text-xs text-gray-400">Zone: {order.zone_id}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {order.game_id?.image_url && (
                          <img src={order.game_id.image_url} alt="Game" className="w-8 h-8 rounded-lg object-cover" />
                        )}
                        <div>
                          <div className="font-semibold text-white">{order.game_id?.name || 'Unknown Game'}</div>
                          <div className="text-xs text-primary">{order.package_id?.name || 'Unknown Package'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-green-400 font-medium">
                      ${order.total_price?.toFixed(2)}
                      <div className="text-xs text-gray-400">{order.payment_method}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={clsx(
                        "px-2 py-1 rounded-full text-xs font-medium border",
                        order.status === 'pending' ? "bg-orange-500/20 text-orange-400 border-orange-500/20" :
                        order.status === 'processing' ? "bg-blue-500/20 text-blue-400 border-blue-500/20" :
                        order.status === 'success' ? "bg-success/20 text-success border-success/20" :
                        "bg-red-500/20 text-red-400 border-red-500/20"
                      )}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex items-center justify-end gap-2">
                      {(order.status === 'pending' || order.status === 'processing') && (
                        <>
                          <button onClick={() => handleUpdateStatus(order._id, 'success')} title="Mark Success" className="p-2 rounded-lg bg-success/10 hover:bg-success/20 text-success transition-colors">
                            <CheckCircle size={16} />
                          </button>
                          <button onClick={() => handleUpdateStatus(order._id, 'failed')} title="Mark Failed" className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors">
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                      <button onClick={() => handleDelete(order._id)} title="Delete Order" className="p-2 rounded-lg bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 transition-colors">
                        <Trash2 size={16} />
                      </button>
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

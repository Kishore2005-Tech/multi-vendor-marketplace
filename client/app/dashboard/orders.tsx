"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api-client";
import { Order } from "@/types";
import { formatCurrency } from "@/lib/utils";

const statusColors: Record<string, string> = {
  created: "text-muted",
  paid: "text-condition-new",
  failed: "text-red-400",
  cancelled: "text-red-400",
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/orders")
      .then(({ data }) => setOrders(data.orders))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted">Loading...</p>;
  if (orders.length === 0) return <p className="text-muted">You haven't placed any orders yet.</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">My Orders</h1>
      {orders.map((order) => (
        <div key={order._id} className="rounded-xl border border-white/10 bg-surface p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">Order #{order._id.slice(-8)}</span>
            <span className={`text-sm font-medium capitalize ${statusColors[order.status]}`}>{order.status}</span>
          </div>
          <div className="mt-2 space-y-1">
            {order.items.map((item) => (
              <div key={item._id} className="flex justify-between text-sm text-white">
                <span>{item.product?.title} × {item.quantity}</span>
                <span>{formatCurrency(item.priceAtPurchase * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 border-t border-white/10 pt-2 text-right font-semibold text-white">
            {formatCurrency(order.totalAmount)}
          </div>
        </div>
      ))}
    </div>
  );
}
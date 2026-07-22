"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api-client";
import { OrderItem } from "@/types";
import { formatCurrency } from "@/lib/utils";

const statusOptions = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;

export default function VendorOrdersPage() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/vendor/orders")
      .then(({ data }) => setOrderItems(data.orderItems))
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, status: string) {
    await apiClient.patch(`/orders/items/${id}/status`, { status });
    setOrderItems((prev) => prev.map((i) => (i._id === id ? { ...i, status: status as any } : i)));
  }

  if (loading) return <p className="text-muted">Loading...</p>;
  if (orderItems.length === 0) return <p className="text-muted">No orders yet.</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Orders</h1>
      {orderItems.map((item) => (
        <div key={item._id} className="flex items-center justify-between rounded-xl border border-white/10 bg-surface p-4">
          <div>
            <p className="font-medium text-white">
              {item.product?.title} × {item.quantity}
            </p>
            <p className="text-sm text-muted">{formatCurrency(item.priceAtPurchase * item.quantity)}</p>
          </div>
          <select
            value={item.status}
            onChange={(e) => updateStatus(item._id, e.target.value)}
            className="rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-white capitalize"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
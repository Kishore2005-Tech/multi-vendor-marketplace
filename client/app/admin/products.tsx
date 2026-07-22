"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface PendingProduct {
  _id: string;
  title: string;
  price: number;
  vendor: { storeName: string };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<PendingProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/admin/products/pending")
      .then(({ data }) => setProducts(data.products))
      .finally(() => setLoading(false));
  }, []);

  async function moderate(id: string, status: "active" | "rejected") {
    const rejectionReason = status === "rejected" ? prompt("Rejection reason:") || "" : undefined;
    await apiClient.patch(`/admin/products/${id}/moderate`, { status, rejectionReason });
    setProducts((prev) => prev.filter((p) => p._id !== id));
  }

  if (loading) return <p className="text-muted">Loading...</p>;
  if (products.length === 0) return <p className="text-muted">No listings awaiting review.</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Pending Product Listings</h1>
      {products.map((p) => (
        <div key={p._id} className="flex items-center justify-between rounded-xl border border-white/10 bg-surface p-4">
          <div>
            <p className="font-medium text-white">{p.title}</p>
            <p className="text-sm text-muted">{p.vendor.storeName} · {formatCurrency(p.price)}</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => moderate(p._id, "rejected")}>
              Reject
            </Button>
            <Button size="sm" onClick={() => moderate(p._id, "active")}>
              Approve
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
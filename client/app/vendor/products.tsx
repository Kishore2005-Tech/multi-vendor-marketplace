"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import apiClient from "@/lib/api-client";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const statusColors: Record<string, string> = {
  pending_review: "text-yellow-400",
  active: "text-condition-new",
  rejected: "text-red-400",
  out_of_stock: "text-muted",
};

export default function VendorProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/vendor/products")
      .then(({ data }) => setProducts(data.products))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">My Listings</h1>
        <Link href="/vendor/products/new">
          <Button>+ New product</Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-muted">You haven't listed any products yet.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-muted">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t border-white/10 text-white">
                  <td className="p-3">{p.title}</td>
                  <td className="p-3">{formatCurrency(p.price)}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className={`p-3 capitalize ${statusColors[p.status]}`}>{p.status.replace("_", " ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api-client";
import { formatCurrency } from "@/lib/utils";

interface Analytics {
  totalVendors: number;
  approvedVendors: number;
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  paidOrderCount: number;
  gmv: number;
}

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/admin/analytics")
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) return <p className="text-muted">Loading...</p>;

  const cards = [
    { label: "Gross Merchandise Value", value: formatCurrency(stats.gmv) },
    { label: "Approved Vendors", value: `${stats.approvedVendors} / ${stats.totalVendors}` },
    { label: "Active Products", value: `${stats.activeProducts} / ${stats.totalProducts}` },
    { label: "Paid Orders", value: `${stats.paidOrderCount} / ${stats.totalOrders}` },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Platform Analytics</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-white/10 bg-surface p-4">
            <p className="text-sm text-muted">{c.label}</p>
            <p className="mt-1 text-2xl font-bold text-white">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
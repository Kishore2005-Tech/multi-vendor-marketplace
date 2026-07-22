"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api-client";
import { formatCurrency } from "@/lib/utils";

export default function VendorPayoutsPage() {
  const [summary, setSummary] = useState<{ pendingAmount: number; pendingItemCount: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/vendor/payouts/summary")
      .then(({ data }) => setSummary(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted">Loading...</p>;

  return (
    <div className="max-w-md space-y-6">
      <h1 className="text-2xl font-bold text-white">Payouts</h1>
      <div className="rounded-xl border border-white/10 bg-surface p-6">
        <p className="text-sm text-muted">Pending payout amount</p>
        <p className="mt-1 text-3xl font-bold text-white">{formatCurrency(summary?.pendingAmount || 0)}</p>
        <p className="mt-2 text-sm text-muted">from {summary?.pendingItemCount || 0} delivered order item(s)</p>
      </div>
      <p className="text-xs text-muted">
        Payouts are calculated after commission and are released once items are marked delivered.
        Automated payout scheduling is on the roadmap.
      </p>
    </div>
  );
}
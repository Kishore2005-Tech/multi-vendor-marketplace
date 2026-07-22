"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api-client";
import { Button } from "@/components/ui/button";

interface PendingVendor {
  _id: string;
  storeName: string;
  status: string;
  user: { name: string; email: string };
}

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<PendingVendor[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchVendors() {
    setLoading(true);
    const { data } = await apiClient.get("/admin/vendors/pending");
    setVendors(data.vendors);
    setLoading(false);
  }

  useEffect(() => {
    fetchVendors();
  }, []);

  async function moderate(id: string, status: "approved" | "rejected") {
    await apiClient.patch(`/admin/vendors/${id}/moderate`, { status });
    setVendors((prev) => prev.filter((v) => v._id !== id));
  }

  if (loading) return <p className="text-muted">Loading...</p>;
  if (vendors.length === 0) return <p className="text-muted">No pending vendor applications.</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Pending Vendor Approvals</h1>
      {vendors.map((v) => (
        <div key={v._id} className="flex items-center justify-between rounded-xl border border-white/10 bg-surface p-4">
          <div>
            <p className="font-medium text-white">{v.storeName}</p>
            <p className="text-sm text-muted">{v.user.name} · {v.user.email}</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => moderate(v._id, "rejected")}>
              Reject
            </Button>
            <Button size="sm" onClick={() => moderate(v._id, "approved")}>
              Approve
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
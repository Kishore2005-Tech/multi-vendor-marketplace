"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import apiClient from "@/lib/api-client";
import ProductCard from "@/components/product-card";
import { Vendor, Product } from "@/types";
import { Star } from "lucide-react";

export default function VendorStorefrontPage() {
  const { vendorId } = useParams<{ vendorId: string }>();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStore() {
      try {
        const { data } = await apiClient.get(`/vendor/store/${vendorId}`);
        setVendor(data.vendor);
        setProducts(data.products);
      } catch {
        setVendor(null);
      } finally {
        setLoading(false);
      }
    }
    fetchStore();
  }, [vendorId]);

  if (loading) return <p className="text-muted">Loading...</p>;
  if (!vendor) return <p className="text-muted">Vendor not found.</p>;

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-white/10 bg-surface p-6">
        <h1 className="text-2xl font-bold text-white">{vendor.storeName}</h1>
        {vendor.description && <p className="mt-2 text-muted">{vendor.description}</p>}
        <p className="mt-2 flex items-center gap-1 text-sm text-muted">
          <Star size={14} className="fill-accent text-accent" />
          {vendor.rating.toFixed(1)} ({vendor.ratingCount} reviews)
        </p>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold text-white">Products from {vendor.storeName}</h2>
        {products.length === 0 ? (
          <p className="text-muted">No products listed yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
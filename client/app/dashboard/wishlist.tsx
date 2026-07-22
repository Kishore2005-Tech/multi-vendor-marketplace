"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api-client";
import ProductCard from "@/components/product-card";
import { Product } from "@/types";

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/auth/me")
      .then(({ data }) => setProducts(data.user.wishlist || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted">Loading...</p>;
  if (products.length === 0) return <p className="text-muted">Your wishlist is empty.</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Wishlist</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api-client";
import ProductCard from "@/components/product-card";
import { Product } from "@/types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set("q", search);
        if (category) params.set("category", category);

        const { data } = await apiClient.get(`/products?${params.toString()}`, {
          signal: controller.signal,
        });
        setProducts(data.products);
      } catch {
        // request was likely aborted by a newer search — safe to ignore
      } finally {
        setLoading(false);
      }
    }

    const debounce = setTimeout(fetchProducts, 300);
    return () => {
      clearTimeout(debounce);
      controller.abort();
    };
  }, [search, category]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="flex-1 rounded-xl border border-white/10 bg-surface px-4 py-2 text-white placeholder:text-muted"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-white/10 bg-surface px-4 py-2 text-white"
        >
          <option value="">All categories</option>
          <option value="phone">Phones</option>
          <option value="laptop">Laptops</option>
          <option value="tablet">Tablets</option>
          <option value="wearable">Wearables</option>
          <option value="accessory">Accessories</option>
        </select>
      </div>

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-muted">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
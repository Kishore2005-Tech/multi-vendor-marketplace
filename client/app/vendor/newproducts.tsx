"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api-client";
import { Button } from "@/components/ui/button";

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "phone",
    brand: "",
    price: "",
    stock: "",
    images: "", // comma-separated Cloudinary URLs, uploaded separately
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiClient.post("/products", {
        title: form.title,
        description: form.description,
        category: form.category,
        brand: form.brand || undefined,
        price: Number(form.price),
        stock: Number(form.stock),
        images: form.images.split(",").map((url) => url.trim()).filter(Boolean),
      });
      router.push("/vendor/products");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold text-white">List a new product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Product title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className="w-full rounded-lg border border-white/10 bg-surface px-3 py-2 text-white"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
          rows={4}
          className="w-full rounded-lg border border-white/10 bg-surface px-3 py-2 text-white"
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full rounded-lg border border-white/10 bg-surface px-3 py-2 text-white"
        >
          <option value="phone">Phone</option>
          <option value="laptop">Laptop</option>
          <option value="tablet">Tablet</option>
          <option value="wearable">Wearable</option>
          <option value="accessory">Accessory</option>
        </select>
        <input
          placeholder="Brand (optional)"
          value={form.brand}
          onChange={(e) => setForm({ ...form, brand: e.target.value })}
          className="w-full rounded-lg border border-white/10 bg-surface px-3 py-2 text-white"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Price (INR)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
            min={1}
            className="rounded-lg border border-white/10 bg-surface px-3 py-2 text-white"
          />
          <input
            type="number"
            placeholder="Stock quantity"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            required
            min={0}
            className="rounded-lg border border-white/10 bg-surface px-3 py-2 text-white"
          />
        </div>
        <input
          placeholder="Image URLs, comma-separated"
          value={form.images}
          onChange={(e) => setForm({ ...form, images: e.target.value })}
          required
          className="w-full rounded-lg border border-white/10 bg-surface px-3 py-2 text-white"
        />
        <p className="text-xs text-muted">
          Upload images to Cloudinary first, then paste the resulting URLs here (comma-separated). A dedicated
          upload widget can replace this field later.
        </p>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Submitting..." : "Submit for review"}
        </Button>
      </form>
    </div>
  );
}
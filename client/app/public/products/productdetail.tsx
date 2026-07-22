"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import apiClient from "@/lib/api-client";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import Link from "next/link";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data } = await apiClient.get(`/products/${slug}`);
        setProduct(data.product);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  if (loading) return <p className="text-muted">Loading...</p>;
  if (!product) return <p className="text-muted">Product not found.</p>;

  const vendor = typeof product.vendor === "object" ? product.vendor : null;

  function handleAddToCart() {
    if (!product) return;
    addItem({
      productId: product._id,
      title: product.title,
      price: product.price,
      image: product.images[0] || "",
      quantity: 1,
      vendorId: vendor?._id || "",
      stock: product.stock,
    });
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-3">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-white/5">
          {product.images[activeImage] && (
            <Image src={product.images[activeImage]} alt={product.title} fill className="object-cover" />
          )}
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={img}
                onClick={() => setActiveImage(i)}
                className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 ${
                  i === activeImage ? "border-primary" : "border-transparent"
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {vendor && (
          <Link href={`/vendors/${vendor.storeSlug}`} className="text-sm text-accent hover:underline">
            {vendor.storeName}
          </Link>
        )}

        <h1 className="text-2xl font-bold text-white">{product.title}</h1>
        <p className="text-3xl font-semibold text-white">{formatCurrency(product.price)}</p>

        <p className="text-sm leading-relaxed text-muted">{product.description}</p>

        <div className="text-sm text-muted">
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </div>

        <Button size="lg" onClick={handleAddToCart} disabled={product.stock === 0} className="w-full">
          {product.stock === 0 ? "Out of stock" : "Add to cart"}
        </Button>
      </div>
    </div>
  );
}
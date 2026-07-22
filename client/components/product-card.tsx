import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Star } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  const vendorName = typeof product.vendor === "object" ? product.vendor.storeName : "";

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-xl border border-white/10 bg-surface transition-transform hover:-translate-y-1"
    >
      <div className="relative aspect-square w-full bg-white/5">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">No image</div>
        )}
      </div>

      <div className="space-y-1 p-3">
        {vendorName && <p className="text-xs text-muted">{vendorName}</p>}
        <h3 className="line-clamp-1 text-sm font-medium text-white">{product.title}</h3>

        <div className="flex items-center justify-between pt-1">
          <span className="text-base font-semibold text-white">{formatCurrency(product.price)}</span>
          {product.ratingCount > 0 && (
            <span className="flex items-center gap-1 text-xs text-muted">
              <Star size={12} className="fill-accent text-accent" />
              {product.rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
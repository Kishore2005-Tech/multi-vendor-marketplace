import Link from "next/link";
import { Vendor } from "@/types";
import { Star } from "lucide-react";

export default function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <Link
      href={`/vendors/${vendor.storeSlug}`}
      className="flex items-center gap-3 rounded-xl border border-white/10 bg-surface p-4 transition-colors hover:border-primary/50"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-lg font-bold text-primary">
        {vendor.storeName.charAt(0).toUpperCase()}
      </div>
      <div>
        <p className="font-medium text-white">{vendor.storeName}</p>
        <p className="flex items-center gap-1 text-xs text-muted">
          <Star size={12} className="fill-accent text-accent" />
          {vendor.rating.toFixed(1)} ({vendor.ratingCount} reviews)
        </p>
      </div>
    </Link>
  );
}
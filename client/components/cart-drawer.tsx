"use client";

import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

// A simple in-page cart list (not a slide-over) — used on /cart.
// Named cart-drawer to match the original project structure spec.
export default function CartDrawer() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-surface p-8 text-center text-muted">
        Your cart is empty.
        <div className="mt-4">
          <Button onClick={() => router.push("/products")}>Browse products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.productId} className="flex items-center gap-4 rounded-xl border border-white/10 bg-surface p-3">
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-white/5">
            {item.image && <Image src={item.image} alt={item.title} fill className="object-cover" />}
          </div>

          <div className="flex-1">
            <p className="text-sm font-medium text-white">{item.title}</p>
            <p className="text-sm text-muted">{formatCurrency(item.price)}</p>
          </div>

          <input
            type="number"
            min={1}
            max={item.stock}
            value={item.quantity}
            onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
            className="w-16 rounded-lg border border-white/10 bg-background px-2 py-1 text-center text-white"
          />

          <button onClick={() => removeItem(item.productId)} className="text-muted hover:text-red-400">
            <Trash2 size={18} />
          </button>
        </div>
      ))}

      <div className="flex items-center justify-between border-t border-white/10 pt-4">
        <span className="text-lg font-semibold text-white">Total: {formatCurrency(totalPrice)}</span>
        <Button size="lg" onClick={() => router.push("/checkout")}>
          Proceed to checkout
        </Button>
      </div>
    </div>
  );
}
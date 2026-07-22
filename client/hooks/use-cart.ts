"use client";

import { useCartStore } from "@/store/cart-store";

// Thin convenience wrapper around the cart store for components
// that only need a subset of cart state/actions.
export function useCart() {
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const totalItems = useCartStore((s) => s.totalItems());
  const totalPrice = useCartStore((s) => s.totalPrice());

  return { items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice };
}
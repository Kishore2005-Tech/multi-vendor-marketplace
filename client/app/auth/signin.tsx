"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import apiClient from "@/lib/api-client";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [address, setAddress] = useState({
    line1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePlaceOrder() {
    setLoading(true);
    setError("");
    try {
      const { data } = await apiClient.post("/orders", {
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        shippingAddress: address,
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(data.amount * 100),
        currency: "INR",
        name: "Vendra",
        description: "Order payment",
        order_id: data.razorpayOrderId,
        handler: async (response: any) => {
          await apiClient.post("/payments/verify", {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          clearCart();
          router.push("/dashboard/orders");
        },
        theme: { color: "#3B82F6" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return <p className="text-muted">Your cart is empty.</p>;
  }

  return (
    <div className="max-w-lg space-y-6">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <h1 className="text-2xl font-bold text-white">Checkout</h1>

      <div className="space-y-3 rounded-xl border border-white/10 bg-surface p-4">
        <input
          placeholder="Address line 1"
          value={address.line1}
          onChange={(e) => setAddress({ ...address, line1: e.target.value })}
          className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-white"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            placeholder="City"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            className="rounded-lg border border-white/10 bg-background px-3 py-2 text-white"
          />
          <input
            placeholder="State"
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })}
            className="rounded-lg border border-white/10 bg-background px-3 py-2 text-white"
          />
        </div>
        <input
          placeholder="Postal code"
          value={address.postalCode}
          onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
          className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-white"
        />
      </div>

      <div className="flex items-center justify-between text-lg font-semibold text-white">
        <span>Total</span>
        <span>{formatCurrency(totalPrice)}</span>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <Button size="lg" className="w-full" onClick={handlePlaceOrder} disabled={loading}>
        {loading ? "Processing..." : "Pay now"}
      </Button>
    </div>
  );
}
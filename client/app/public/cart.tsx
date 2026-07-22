import CartDrawer from "@/components/cart-drawer";

export default function CartPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-white">Your Cart</h1>
      <CartDrawer />
    </div>
  );
}
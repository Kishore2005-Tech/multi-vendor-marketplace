"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Store, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-white">
          Vendra
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link href="/products" className="text-sm text-muted hover:text-white">
            Browse
          </Link>
          {user?.role === "vendor" && (
            <Link href="/vendor/products" className="flex items-center gap-1 text-sm text-muted hover:text-white">
              <Store size={16} /> Vendor Dashboard
            </Link>
          )}
          {user?.role === "admin" && (
            <Link href="/admin/vendors" className="flex items-center gap-1 text-sm text-muted hover:text-white">
              <LayoutDashboard size={16} /> Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/cart" className="relative text-white">
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-background">
                {totalItems}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <>
              <Link href="/dashboard/orders" className="text-sm text-muted hover:text-white">
                {user?.name}
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
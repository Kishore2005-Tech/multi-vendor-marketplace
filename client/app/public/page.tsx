import Link from "next/link";
import apiClient from "@/lib/api-client";
import ProductCard from "@/components/product-card";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const { data } = await apiClient.get("/products?limit=8");
    return data.products;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div className="space-y-16">
      <section className="rounded-2xl border border-white/10 bg-surface px-8 py-16 text-center">
        <h1 className="text-4xl font-bold text-white md:text-5xl">
          Shop from every vendor, <span className="text-accent">all in one place</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          Vendra brings independent sellers together on a single, secure marketplace.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/products">
            <Button size="lg">Browse products</Button>
          </Link>
          <Link href="/sign-up">
            <Button variant="secondary" size="lg">Become a vendor</Button>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-semibold text-white">Featured products</h2>
        {products.length === 0 ? (
          <p className="text-muted">No products yet — check back soon.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
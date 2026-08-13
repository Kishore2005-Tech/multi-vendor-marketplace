"use client";






interface PendingProduct {
  _id: string;
  title: string;
  price: number;
  vendor: { storeName: string };
}

export default function AdminProductsPage() {
 
 

  useEffect(() => {
    apiClient
      .get("/admin/products/pending")
      .then(({ data }) => setProducts(data.products))
      .finally(() => setLoading(false));
  }, []);

  async function moderate(id: string, status: "active" | "rejected") {
    
    
    setProducts((prev) => prev.filter((p) => p._id !== id));
  }

  
  if (products.length === 0) return <p className="text-muted">No listings awaiting review.</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Pending Product Listings</h1>
      {products.map((p) => (
        <div key={p._id} className="flex items-center justify-between rounded-xl border border-white/10 bg-surface p-4">
          <div>
            <p className="font-medium text-white">{p.title}</p>
            <p className="text-sm text-muted">{p.vendor.storeName} · {formatCurrency(p.price)}</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => moderate(p._id, "rejected")}>
              Reject
            </Button>
            <Button size="sm" onClick={() => moderate(p._id, "active")}>
              Approve
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

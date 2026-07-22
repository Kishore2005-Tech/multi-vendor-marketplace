export type UserRole = "buyer" | "vendor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Vendor {
  _id: string;
  storeName: string;
  storeSlug: string;
  description?: string;
  logo?: string;
  banner?: string;
  status: "pending" | "approved" | "rejected" | "suspended";
  rating: number;
  ratingCount: number;
  totalSales: number;
}

export interface Product {
  _id: string;
  vendor: Vendor | string;
  title: string;
  slug: string;
  description: string;
  category: string;
  brand?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  images: string[];
  status: "pending_review" | "active" | "rejected" | "out_of_stock";
  rating: number;
  ratingCount: number;
}

export interface OrderItem {
  _id: string;
  product: Product;
  vendor: string;
  quantity: number;
  priceAtPurchase: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
}

export interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: "created" | "paid" | "failed" | "cancelled";
  createdAt: string;
  shippingAddress: {
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  vendorId: string;
  stock: number;
}
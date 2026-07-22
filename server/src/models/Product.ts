import mongoose, { Schema, Document, Model } from "mongoose";

export type ProductStatus = "pending_review" | "active" | "rejected" | "out_of_stock";

export interface IProduct extends Document {
  vendor: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  category: string;
  brand?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  images: string[];
  status: ProductStatus;
  rejectionReason?: string;
  rating: number;
  ratingCount: number;
  views: number;
  createdAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    vendor: { type: Schema.Types.ObjectId, ref: "Vendor", required: true, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    brand: { type: String },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number },
    stock: { type: Number, required: true, default: 0, min: 0 },
    images: [{ type: String }],
    status: { type: String, enum: ["pending_review", "active", "rejected", "out_of_stock"], default: "pending_review" },
    rejectionReason: { type: String },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ title: "text", description: "text", category: "text", brand: "text" });

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);
export default Product;
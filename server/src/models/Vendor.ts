import mongoose, { Schema, Document, Model } from "mongoose";

export type VendorStatus = "pending" | "approved" | "rejected" | "suspended";

export interface IVendor extends Document {
  user: mongoose.Types.ObjectId;
  storeName: string;
  storeSlug: string;
  description?: string;
  logo?: string;
  banner?: string;
  status: VendorStatus;
  commissionPercent: number;
  bankDetails?: {
    accountHolder: string;
    accountNumber: string;
    ifsc: string;
  };
  rating: number;
  ratingCount: number;
  totalSales: number;
  createdAt: Date;
}

const vendorSchema = new Schema<IVendor>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    storeName: { type: String, required: true, trim: true },
    storeSlug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String },
    logo: { type: String },
    banner: { type: String },
    status: { type: String, enum: ["pending", "approved", "rejected", "suspended"], default: "pending" },
    commissionPercent: { type: Number, default: Number(process.env.PLATFORM_COMMISSION_PERCENT) || 10 },
    bankDetails: {
      accountHolder: String,
      accountNumber: String,
      ifsc: String,
    },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Vendor: Model<IVendor> = mongoose.models.Vendor || mongoose.model<IVendor>("Vendor", vendorSchema);
export default Vendor;
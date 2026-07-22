import mongoose, { Schema, Document, Model } from "mongoose";

export type OrderItemStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface IOrderItem extends Document {
  order: mongoose.Types.ObjectId;
  vendor: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  quantity: number;
  priceAtPurchase: number;
  commissionPercent: number;
  commissionAmount: number;
  vendorEarning: number;
  status: OrderItemStatus;
  createdAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true, index: true },
    vendor: { type: Schema.Types.ObjectId, ref: "Vendor", required: true, index: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    priceAtPurchase: { type: Number, required: true },
    commissionPercent: { type: Number, required: true },
    commissionAmount: { type: Number, required: true },
    vendorEarning: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const OrderItem: Model<IOrderItem> =
  mongoose.models.OrderItem || mongoose.model<IOrderItem>("OrderItem", orderItemSchema);
export default OrderItem;
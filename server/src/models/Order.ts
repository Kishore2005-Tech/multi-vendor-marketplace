import mongoose, { Schema, Document, Model } from "mongoose";

export type OrderStatus = "created" | "paid" | "failed" | "cancelled";

export interface IOrder extends Document {
  buyer: mongoose.Types.ObjectId;
  items: mongoose.Types.ObjectId[]; // refs to OrderItem (per-vendor sub-orders)
  totalAmount: number;
  shippingAddress: {
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  status: OrderStatus;
  createdAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: [{ type: Schema.Types.ObjectId, ref: "OrderItem" }],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
      line1: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    status: { type: String, enum: ["created", "paid", "failed", "cancelled"], default: "created" },
  },
  { timestamps: true }
);

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);
export default Order;
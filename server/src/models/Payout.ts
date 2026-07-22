import mongoose, { Schema, Document, Model } from "mongoose";

export type PayoutStatus = "pending" | "processing" | "paid" | "failed";

export interface IPayout extends Document {
  vendor: mongoose.Types.ObjectId;
  orderItems: mongoose.Types.ObjectId[];
  amount: number;
  status: PayoutStatus;
  paidAt?: Date;
  reference?: string;
  createdAt: Date;
}

const payoutSchema = new Schema<IPayout>(
  {
    vendor: { type: Schema.Types.ObjectId, ref: "Vendor", required: true, index: true },
    orderItems: [{ type: Schema.Types.ObjectId, ref: "OrderItem", required: true }],
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "processing", "paid", "failed"], default: "pending" },
    paidAt: { type: Date },
    reference: { type: String },
  },
  { timestamps: true }
);

const Payout: Model<IPayout> = mongoose.models.Payout || mongoose.model<IPayout>("Payout", payoutSchema);
export default Payout;
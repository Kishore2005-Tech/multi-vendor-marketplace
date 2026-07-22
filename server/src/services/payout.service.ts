import OrderItem from "../models/OrderItem";
import Vendor from "../models/Vendor";

/**
 * Given a base price and a vendor's commission rate, compute the
 * platform's cut and the vendor's net earning for one line item.
 */
export function calculateCommissionSplit(price: number, quantity: number, commissionPercent: number) {
  const gross = price * quantity;
  const commissionAmount = Math.round(gross * (commissionPercent / 100) * 100) / 100;
  const vendorEarning = Math.round((gross - commissionAmount) * 100) / 100;
  return { gross, commissionAmount, vendorEarning };
}

/**
 * Sum a vendor's unpaid earnings from delivered order items —
 * this is what would be batched into their next Payout record.
 */
export async function getVendorPendingEarnings(vendorId: string) {
  const items = await OrderItem.find({
    vendor: vendorId,
    status: "delivered",
  });

  const total = items.reduce((sum, item) => sum + item.vendorEarning, 0);
  return { total, itemIds: items.map((i) => i._id) };
}

export async function updateVendorTotalSales(vendorId: string, amount: number) {
  await Vendor.findByIdAndUpdate(vendorId, { $inc: { totalSales: amount } });
}
import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import Order from "../models/Order";
import { verifyPaymentSignature } from "../services/payment.service";
import { updateVendorTotalSales } from "../services/payout.service";
import OrderItem from "../models/OrderItem";

export async function verifyPayment(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const isValid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    if (!isValid) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const order = await Order.findOne({ razorpayOrderId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = "paid";
    order.razorpayPaymentId = razorpayPaymentId;
    await order.save();

    const orderItems = await OrderItem.find({ order: order._id });
    for (const item of orderItems) {
      item.status = "confirmed";
      await item.save();
      await updateVendorTotalSales(item.vendor.toString(), item.vendorEarning);
    }

    res.json({ message: "Payment verified", order });
  } catch (err) {
    next(err);
  }
}
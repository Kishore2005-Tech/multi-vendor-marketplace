import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import Order from "../models/Order";
import OrderItem from "../models/OrderItem";
import Product from "../models/Product";
import Vendor from "../models/Vendor";
import { createOrderSchema } from "../utils/validators";
import { calculateCommissionSplit } from "../services/payout.service";
import { createRazorpayOrder } from "../services/payment.service";
import { notifyOrderPlaced } from "../services/notification.service";

// Creates the Order + per-vendor OrderItems, then a matching Razorpay order.
export async function createOrder(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const parsed = createOrderSchema.parse(req.body);

    const productIds = parsed.items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: productIds }, status: "active" }).populate("vendor");

    if (products.length !== parsed.items.length) {
      return res.status(400).json({ message: "One or more products are unavailable" });
    }

    let totalAmount = 0;
    const orderItemDrafts: any[] = [];

    for (const item of parsed.items) {
      const product = products.find((p) => p._id.toString() === item.productId)!;
      const vendor: any = product.vendor;

      const { gross, commissionAmount, vendorEarning } = calculateCommissionSplit(
        product.price,
        item.quantity,
        vendor.commissionPercent
      );

      totalAmount += gross;

      orderItemDrafts.push({
        vendor: vendor._id,
        product: product._id,
        quantity: item.quantity,
        priceAtPurchase: product.price,
        commissionPercent: vendor.commissionPercent,
        commissionAmount,
        vendorEarning,
        vendorEmail: vendor.email,
      });
    }

    const order = await Order.create({
      buyer: req.user!._id,
      items: [],
      totalAmount,
      shippingAddress: parsed.shippingAddress,
      status: "created",
    });

    const orderItems = await OrderItem.insertMany(
      orderItemDrafts.map((draft) => ({ ...draft, order: order._id }))
    );

    order.items = orderItems.map((i) => i._id);
    await order.save();

    const razorpayOrder = await createRazorpayOrder(totalAmount, order._id.toString());
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    // fire-and-forget notifications to each vendor
    for (const item of orderItemDrafts) {
      notifyOrderPlaced(item.vendorEmail || "vendor@example.com", order._id.toString()).catch(() => {});
    }

    res.status(201).json({ order, razorpayOrderId: razorpayOrder.id, amount: totalAmount });
  } catch (err) {
    next(err);
  }
}

export async function getMyOrders(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const orders = await Order.find({ buyer: req.user!._id })
      .populate({ path: "items", populate: { path: "product", select: "title images" } })
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (err) {
    next(err);
  }
}

export async function getOrderById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const order = await Order.findOne({ _id: req.params.id, buyer: req.user!._id }).populate({
      path: "items",
      populate: { path: "product", select: "title images" },
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ order });
  } catch (err) {
    next(err);
  }
}

export async function updateOrderItemStatus(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const vendor = (req as any).vendor;
    const { status } = req.body;

    const orderItem = await OrderItem.findOne({ _id: req.params.id, vendor: vendor._id });
    if (!orderItem) return res.status(404).json({ message: "Order item not found" });

    orderItem.status = status;
    await orderItem.save();

    res.json({ orderItem });
  } catch (err) {
    next(err);
  }
}
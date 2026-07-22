import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import Vendor from "../models/Vendor";
import Product from "../models/Product";
import Order from "../models/Order";
import { notifyVendorApproved } from "../services/notification.service";

export async function listPendingVendors(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const vendors = await Vendor.find({ status: "pending" }).populate("user", "name email");
    res.json({ vendors });
  } catch (err) {
    next(err);
  }
}

export async function moderateVendor(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { status } = req.body; // "approved" | "rejected"
    const vendor = await Vendor.findById(req.params.id).populate("user", "email");
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    vendor.status = status;
    await vendor.save();

    if (status === "approved") {
      const user: any = vendor.user;
      notifyVendorApproved(user.email).catch(() => {});
    }

    res.json({ vendor });
  } catch (err) {
    next(err);
  }
}

export async function listPendingProducts(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const products = await Product.find({ status: "pending_review" }).populate("vendor", "storeName");
    res.json({ products });
  } catch (err) {
    next(err);
  }
}

export async function moderateProduct(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { status, rejectionReason } = req.body; // "active" | "rejected"
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.status = status;
    if (status === "rejected") product.rejectionReason = rejectionReason;
    await product.save();

    res.json({ product });
  } catch (err) {
    next(err);
  }
}

export async function getAnalytics(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const [totalVendors, approvedVendors, totalProducts, activeProducts, totalOrders, paidOrders] =
      await Promise.all([
        Vendor.countDocuments(),
        Vendor.countDocuments({ status: "approved" }),
        Product.countDocuments(),
        Product.countDocuments({ status: "active" }),
        Order.countDocuments(),
        Order.find({ status: "paid" }),
      ]);

    const gmv = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    res.json({
      totalVendors,
      approvedVendors,
      totalProducts,
      activeProducts,
      totalOrders,
      paidOrderCount: paidOrders.length,
      gmv,
    });
  } catch (err) {
    next(err);
  }
}
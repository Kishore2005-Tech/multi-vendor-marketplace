import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import Vendor from "../models/Vendor";
import Product from "../models/Product";
import OrderItem from "../models/OrderItem";
import { vendorOnboardSchema } from "../utils/validators";
import slugify from "../utils/slugify";
import { getVendorPendingEarnings } from "../services/payout.service";

export async function onboardVendor(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const parsed = vendorOnboardSchema.parse(req.body);

    const existing = await Vendor.findOne({ user: req.user!._id });
    if (existing) return res.status(400).json({ message: "Vendor profile already exists" });

    const storeSlug = `${slugify(parsed.storeName)}-${Date.now().toString(36)}`;

    const vendor = await Vendor.create({
      user: req.user!._id,
      storeName: parsed.storeName,
      storeSlug,
      description: parsed.description,
      status: "pending",
    });

    req.user!.role = "vendor";
    await req.user!.save();

    res.status(201).json({ vendor });
  } catch (err) {
    next(err);
  }
}

export async function getVendorStorefront(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const vendor = await Vendor.findOne({ storeSlug: req.params.vendorId, status: "approved" });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    const products = await Product.find({ vendor: vendor._id, status: "active" });

    res.json({ vendor, products });
  } catch (err) {
    next(err);
  }
}

export async function getMyVendorProducts(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const vendor = (req as any).vendor;
    const products = await Product.find({ vendor: vendor._id }).sort({ createdAt: -1 });
    res.json({ products });
  } catch (err) {
    next(err);
  }
}

export async function getMyVendorOrders(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const vendor = (req as any).vendor;
    const orderItems = await OrderItem.find({ vendor: vendor._id })
      .populate("product", "title images")
      .populate("order", "shippingAddress createdAt")
      .sort({ createdAt: -1 });

    res.json({ orderItems });
  } catch (err) {
    next(err);
  }
}

export async function getMyPayoutSummary(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const vendor = (req as any).vendor;
    const summary = await getVendorPendingEarnings(vendor._id.toString());
    res.json({ pendingAmount: summary.total, pendingItemCount: summary.itemIds.length });
  } catch (err) {
    next(err);
  }
}
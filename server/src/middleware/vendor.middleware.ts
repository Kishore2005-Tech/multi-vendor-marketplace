import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import Vendor from "../models/Vendor";

export async function requireVendor(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user || req.user.role !== "vendor") {
      return res.status(403).json({ message: "Vendor access only" });
    }

    const vendor = await Vendor.findOne({ user: req.user._id });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor profile not found. Complete onboarding first." });
    }

    if (vendor.status !== "approved") {
      return res.status(403).json({ message: `Vendor account is ${vendor.status}, not yet approved` });
    }

    (req as any).vendor = vendor;
    next();
  } catch (err) {
    next(err);
  }
}
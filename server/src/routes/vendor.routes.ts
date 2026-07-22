import { Router } from "express";
import {
  onboardVendor,
  getVendorStorefront,
  getMyVendorProducts,
  getMyVendorOrders,
  getMyPayoutSummary,
} from "../controllers/vendor.controller";
import { protect } from "../middleware/auth.middleware";
import { requireVendor } from "../middleware/vendor.middleware";

const router = Router();

router.post("/onboard", protect, onboardVendor);
router.get("/store/:vendorId", getVendorStorefront);
router.get("/products", protect, requireVendor, getMyVendorProducts);
router.get("/orders", protect, requireVendor, getMyVendorOrders);
router.get("/payouts/summary", protect, requireVendor, getMyPayoutSummary);

export default router;
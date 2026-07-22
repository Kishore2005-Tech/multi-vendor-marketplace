import { Router } from "express";
import {
  listPendingVendors,
  moderateVendor,
  listPendingProducts,
  moderateProduct,
  getAnalytics,
} from "../controllers/admin.controller";
import { protect } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";

const router = Router();

router.use(protect, requireAdmin);

router.get("/vendors/pending", listPendingVendors);
router.patch("/vendors/:id/moderate", moderateVendor);
router.get("/products/pending", listPendingProducts);
router.patch("/products/:id/moderate", moderateProduct);
router.get("/analytics", getAnalytics);

export default router;
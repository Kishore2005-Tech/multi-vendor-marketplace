import { Router } from "express";
import { listProducts, getProductBySlug, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller";
import { protect } from "../middleware/auth.middleware";
import { requireVendor } from "../middleware/vendor.middleware";

const router = Router();

router.get("/", listProducts);
router.get("/:slug", getProductBySlug);
router.post("/", protect, requireVendor, createProduct);
router.patch("/:id", protect, requireVendor, updateProduct);
router.delete("/:id", protect, requireVendor, deleteProduct);

export default router;
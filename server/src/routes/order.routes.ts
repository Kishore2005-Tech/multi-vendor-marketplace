import { Router } from "express";
import { createOrder, getMyOrders, getOrderById, updateOrderItemStatus } from "../controllers/order.controller";
import { protect } from "../middleware/auth.middleware";
import { requireVendor } from "../middleware/vendor.middleware";

const router = Router();

router.post("/", protect, createOrder);
router.get("/", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.patch("/items/:id/status", protect, requireVendor, updateOrderItemStatus);

export default router;
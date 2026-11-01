import { Router } from "express";
import { verifyPayment } from "../controllers/payment.controller";
import { protect } from "../middleware/auth.middleware";



router.post("/verify", protect, verifyPayment);

export default router;

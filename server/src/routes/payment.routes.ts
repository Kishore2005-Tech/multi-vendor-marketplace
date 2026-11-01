import { Router } from "express";
import { verifyPayment } from "../controllers/payment.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();




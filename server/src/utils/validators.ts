import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["buyer", "vendor"]).optional().default("buyer"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createProductSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  category: z.string().min(2),
  brand: z.string().optional(),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().optional(),
  stock: z.number().int().min(0),
  images: z.array(z.string().url()).min(1),
});

export const vendorOnboardSchema = z.object({
  storeName: z.string().min(2).max(100),
  description: z.string().optional(),
});

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().min(1),
      })
    )
    .min(1),
  shippingAddress: z.object({
    line1: z.string().min(3),
    city: z.string().min(2),
    state: z.string().min(2),
    postalCode: z.string().min(3),
    country: z.string().min(2),
  }),
});
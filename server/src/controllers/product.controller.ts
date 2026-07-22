import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import Product from "../models/Product";
import { createProductSchema } from "../utils/validators";
import slugify from "../utils/slugify";

export async function listProducts(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { q, category, minPrice, maxPrice, page = "1", limit = "12" } = req.query;

    const filter: any = { status: "active" };
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (q) filter.$text = { $search: String(q) };

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("vendor", "storeName storeSlug rating")
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .sort({ createdAt: -1 }),
      Product.countDocuments(filter),
    ]);

    res.json({ products, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
  } catch (err) {
    next(err);
  }
}

export async function getProductBySlug(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const product = await Product.findOne({ slug: req.params.slug, status: "active" }).populate(
      "vendor",
      "storeName storeSlug rating logo"
    );

    if (!product) return res.status(404).json({ message: "Product not found" });

    product.views += 1;
    await product.save();

    res.json({ product });
  } catch (err) {
    next(err);
  }
}

export async function createProduct(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const parsed = createProductSchema.parse(req.body);
    const vendor = (req as any).vendor;

    const slug = `${slugify(parsed.title)}-${Date.now().toString(36)}`;

    const product = await Product.create({
      ...parsed,
      slug,
      vendor: vendor._id,
      status: "pending_review",
    });

    res.status(201).json({ product });
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const vendor = (req as any).vendor;
    const product = await Product.findOne({ _id: req.params.id, vendor: vendor._id });

    if (!product) return res.status(404).json({ message: "Product not found" });

    Object.assign(product, req.body);
    await product.save();

    res.json({ product });
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const vendor = (req as any).vendor;
    const product = await Product.findOneAndDelete({ _id: req.params.id, vendor: vendor._id });

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
}
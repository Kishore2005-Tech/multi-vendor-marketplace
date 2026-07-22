import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { generateToken } from "../utils/generateToken";
import { registerSchema, loginSchema } from "../utils/validators";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = registerSchema.parse(req.body);

    const existing = await User.findOne({ email: parsed.email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create(parsed);
    const token = generateToken(user._id.toString(), user.role);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = loginSchema.parse(req.body);

    const user = await User.findOne({ email: parsed.email }).select("+password");
    if (!user || !(await user.comparePassword(parsed.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id.toString(), user.role);

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req: any, res: Response) {
  res.json({ user: req.user });
}
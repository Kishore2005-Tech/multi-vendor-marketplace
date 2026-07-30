import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
 
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
}

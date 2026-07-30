import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";


 
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
}

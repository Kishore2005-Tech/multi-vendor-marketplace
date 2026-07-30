import { Response, NextFunction } from "express";



 
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
}

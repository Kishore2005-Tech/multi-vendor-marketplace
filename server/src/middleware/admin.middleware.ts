



 
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
}

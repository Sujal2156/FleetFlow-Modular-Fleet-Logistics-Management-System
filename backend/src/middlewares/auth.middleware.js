import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "JWT_SECRET is not configured" });
    }

    const payload = jwt.verify(token, secret);
    const user = await User.findById(payload.sub).select("_id fullName email role");

    if (!user) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired authentication token" });
  }
}

export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return next();
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return next();
    }

    const payload = jwt.verify(token, secret);
    const user = await User.findById(payload.sub).select("_id fullName email role");
    if (user) {
      req.user = user;
    }

    return next();
  } catch (error) {
    return next();
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    next();
  };
}

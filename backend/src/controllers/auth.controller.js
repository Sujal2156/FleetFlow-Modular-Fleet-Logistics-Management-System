import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import crypto from "crypto";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return secret;
}

function buildAuthResponse(user) {
  const token = jwt.sign(
    {
      role: user.role,
      email: user.email,
    },
    getJwtSecret(),
    {
      subject: String(user._id),
      expiresIn: "8h",
    }
  );

  return {
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  };
}

export async function register(req, res, next) {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "fullName, email and password are required" });
    }

    const existingUser = await User.findOne({ email: String(email).toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const usersCount = await User.countDocuments();
    const requestedRole = role || "Dispatcher";
    const finalRole = usersCount === 0 ? "Manager" : requestedRole;

    if (!["Manager", "Dispatcher", "Safety Officer"].includes(finalRole)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (usersCount > 0 && req.user?.role !== "Manager") {
      return res.status(403).json({ message: "Only Manager can create users" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email,
      passwordHash,
      role: finalRole,
    });

    return res.status(201).json(buildAuthResponse(user));
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.status(200).json(buildAuthResponse(user));
  } catch (error) {
    return next(error);
  }
}

export async function me(req, res) {
  return res.status(200).json({
    user: {
      id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      role: req.user.role,
    },
  });
}

export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user) {
      // Don't reveal if email exists for security
      return res.status(200).json({ message: "If an account exists, password reset link sent to email" });
    }

    // Generate reset token (32 bytes = 64 hex chars)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
    const resetExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    await User.findByIdAndUpdate(user._id, {
      passwordResetToken: resetTokenHash,
      passwordResetExpiry: resetExpiry,
    });

    // In production, send email here with resetToken
    // For now, return token in response (NOT for prod!)
    console.log(`Password reset token for ${email}: ${resetToken}`);

    return res.status(200).json({
      message: "Password reset link sent to email",
      // NOTE: For development only - remove in production
      resetToken: process.env.NODE_ENV === "development" ? resetToken : undefined,
    });
  } catch (error) {
    return next(error);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: tokenHash,
      passwordResetExpiry: { $gt: new Date() }, // Token must not be expired
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired password reset token" });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await User.findByIdAndUpdate(user._id, {
      passwordHash,
      passwordResetToken: null,
      passwordResetExpiry: null,
    });

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return next(error);
  }
}

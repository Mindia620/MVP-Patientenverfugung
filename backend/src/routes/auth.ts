import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { authSchema } from "../schemas/auth.js";
import { config, isProduction } from "../config.js";
import { requireAuth } from "../middleware/auth.js";

export const authRouter = Router();

const cookieBase = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax" as const,
  maxAge: 1000 * 60 * 60 * 24 * 7,
};

const signToken = (userId: string) =>
  jwt.sign({ userId }, config.jwtSecret, {
    expiresIn: "7d",
  });

authRouter.post("/register", async (req, res) => {
  const parsed = authSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid email or password." });
  }

  const { email, password } = parsed.data;
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return res.status(409).json({ message: "Email already in use." });
  }

  const passwordHash = await bcrypt.hash(password, config.bcryptRounds);
  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      passwordHash,
    },
  });

  const token = signToken(user.id);
  res.cookie(config.cookieName, token, cookieBase);
  return res.status(201).json({
    user: { id: user.id, email: user.email },
  });
});

authRouter.post("/login", async (req, res) => {
  const parsed = authSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid email or password." });
  }

  const { email, password } = parsed.data;
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const token = signToken(user.id);
  res.cookie(config.cookieName, token, cookieBase);
  return res.json({
    user: { id: user.id, email: user.email },
  });
});

authRouter.post("/logout", (_req, res) => {
  res.clearCookie(config.cookieName, cookieBase);
  return res.status(204).send();
});

authRouter.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, email: true, createdAt: true },
  });

  if (!user) {
    res.clearCookie(config.cookieName, cookieBase);
    return res.status(401).json({ message: "Session no longer valid." });
  }

  return res.json({ user });
});

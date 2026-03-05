import dotenv from "dotenv";

dotenv.config();

const parseIntOr = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const config = {
  port: parseIntOr(process.env.PORT, 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  jwtSecret: process.env.JWT_SECRET ?? "change-this-in-production",
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:5173",
  bcryptRounds: parseIntOr(process.env.BCRYPT_ROUNDS, 12),
  cookieName: "vorsorge_wizard_token",
  wizardSchemaVersion: 1,
  contentTemplateVersion: 1,
};

export const isProduction = config.nodeEnv === "production";

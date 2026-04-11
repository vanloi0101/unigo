#!/usr/bin/env node
/**
 * Environment Variables Checker
 * Script to verify all required environment variables are properly loaded
 */

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Fix for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, ".env") });

console.log("\n🔍 ===== ENVIRONMENT VARIABLES CHECK =====\n");

// Define required environment variables
const requiredEnvVars = [
  { key: "PORT", type: "number" },
  { key: "NODE_ENV", type: "string" },
  { key: "DATABASE_URL", type: "string", sensitive: true },
  { key: "JWT_SECRET", type: "string", sensitive: true },
  { key: "JWT_EXPIRE", type: "string" },
  { key: "CORS_ORIGIN", type: "string" },
];

let allValid = true;
const results = [];

requiredEnvVars.forEach(({ key, type, sensitive }) => {
  const value = process.env[key];
  const exists = value !== undefined && value !== "";
  const displayValue = sensitive && exists ? "••••••••••" : value || "NOT SET";

  const status = exists ? "✅" : "❌";
  const result = {
    status,
    key,
    value: displayValue,
    type,
  };

  results.push(result);

  if (!exists) {
    allValid = false;
  }

  console.log(`${status} ${key}: ${displayValue}`);
});

console.log("\n" + "=".repeat(45) + "\n");

if (allValid) {
  console.log("✅ All environment variables are properly configured!\n");
  process.exit(0);
} else {
  console.log("❌ Some environment variables are missing or not set!\n");
  console.log("Please add the missing variables to your .env file.\n");
  process.exit(1);
}

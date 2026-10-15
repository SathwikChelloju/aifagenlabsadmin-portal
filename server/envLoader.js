/**
 * Server-Side Environment Loader Utility
 * AIFA GEN LABS Admin Portal
 *
 * Loads environment variables from .env on the server side only.
 * Safe against exposing secrets to Vite client bundles.
 * Zero external dependencies (uses Node.js native capabilities).
 * Never prints or logs sensitive credential values.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let isEnvLoaded = false;

/**
 * Loads the .env file located at admin_portal/admin_portal/.env
 */
export function loadServerEnv() {
  if (isEnvLoaded) return;

  const candidatePaths = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(__dirname, "../.env"),
  ];

  for (const envPath of candidatePaths) {
    if (fs.existsSync(envPath)) {
      try {
        // 1. Try Node.js native loadEnvFile (available in Node.js v20.6+)
        if (typeof process.loadEnvFile === "function") {
          process.loadEnvFile(envPath);
          isEnvLoaded = true;
          return;
        }

        // 2. Safe fallback parser for environments without process.loadEnvFile
        const content = fs.readFileSync(envPath, "utf8");
        const lines = content.split("\n");
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) continue;
          const eqIdx = trimmed.indexOf("=");
          if (eqIdx !== -1) {
            const key = trimmed.slice(0, eqIdx).trim();
            let val = trimmed.slice(eqIdx + 1).trim();
            // Remove wrapping quotes if present
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.slice(1, -1);
            }
            if (key && !process.env[key]) {
              process.env[key] = val;
            }
          }
        }
        isEnvLoaded = true;
        return;
      } catch {
        // Silently fail without logging secrets
      }
    }
  }

  isEnvLoaded = true;
}

// Auto-invoke on module load
loadServerEnv();

import "../../server/envLoader.js";
import { revokeSessionToken } from "../../server/authService.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const authHeader = req.headers.authorization || "";
  let token = authHeader.replace(/^Bearer\s+/i, "").trim();

  if (!token && req.body) {
    try {
      const parsed = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      token = parsed?.token;
    } catch {}
  }

  if (token) {
    revokeSessionToken(token);
  }

  return res.status(200).json({ success: true, message: "Logged out successfully" });
}

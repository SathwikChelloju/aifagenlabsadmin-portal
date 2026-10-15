import "../../server/envLoader.js";
import { verifySessionToken } from "../../server/authService.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  const result = verifySessionToken(token);

  if (result.valid) {
    return res.status(200).json({ success: true, user: result.user });
  }

  return res.status(401).json({ success: false, error: result.error });
}

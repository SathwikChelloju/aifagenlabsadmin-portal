import "../../server/envLoader.js";
import { authenticateUser } from "../../server/authService.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const result = authenticateUser(payload);
    return res.status(result.success ? 200 : 401).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

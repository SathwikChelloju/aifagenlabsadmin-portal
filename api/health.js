import "../server/envLoader.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const hasGemini = !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
  const hasGroq = !!(process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY);

  return res.status(200).json({
    status: "ok",
    aiProvider: hasGemini ? "gemini" : hasGroq ? "groq" : "local_semantic_parser",
    hasApiKey: hasGemini || hasGroq,
    environment: process.env.NODE_ENV || "production",
    platform: "vercel",
  });
}

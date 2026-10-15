/**
 * Node.js & Express-compatible HTTP Server for Secure AI Integration
 * AIFA GEN LABS Admin Portal
 *
 * Runs on Port 5001 (or process.env.PORT)
 * Keeps Gemini / Groq API keys completely server-side.
 * Endpoints:
 * - GET  /api/health
 * - POST /api/assistant/interpret
 */

import http from "node:http";
import "./envLoader.js";
import { processChatWithAi } from "./aiService.js";
import {
  authenticateUser,
  verifySessionToken,
  revokeSessionToken,
} from "./authService.js";

const PORT = process.env.PORT || 5001;

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

export const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  // Health endpoint
  if (req.method === "GET" && url.pathname === "/api/health") {
    const hasGemini = !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
    const hasGroq = !!process.env.GROQ_API_KEY;

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "ok",
        aiProvider: hasGemini ? "gemini" : hasGroq ? "groq" : "local_semantic_parser",
        hasApiKey: hasGemini || hasGroq,
        environment: process.env.NODE_ENV || "development",
      })
    );
    return;
  }

  // Authentication: Login endpoint
  if (req.method === "POST" && url.pathname === "/api/auth/login") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      try {
        const payload = body ? JSON.parse(body) : {};
        const result = authenticateUser(payload);
        if (result.success) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(result));
        } else {
          res.writeHead(401, { "Content-Type": "application/json" });
          res.end(JSON.stringify(result));
        }
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // Authentication: Session verification endpoint
  if (req.method === "GET" && url.pathname === "/api/auth/session") {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    const result = verifySessionToken(token);
    if (result.valid) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, user: result.user }));
    } else {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: result.error }));
    }
    return;
  }

  // Authentication: Logout endpoint
  if (req.method === "POST" && url.pathname === "/api/auth/logout") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      const authHeader = req.headers.authorization || "";
      let token = authHeader.replace(/^Bearer\s+/i, "").trim();
      if (!token && body) {
        try {
          token = JSON.parse(body)?.token;
        } catch {
          // ignore
        }
      }
      if (token) {
        revokeSessionToken(token);
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, message: "Logged out successfully" }));
    });
    return;
  }

  // AI Intent interpretation endpoint
  if (req.method === "POST" && url.pathname === "/api/assistant/interpret") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        const payload = body ? JSON.parse(body) : {};
        const result = await processChatWithAi(payload);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      } catch (err) {
        console.error("Server interpretation error:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            success: false,
            error: err.message || "Failed to process question",
          })
        );
      }
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Endpoint not found" }));
});

// Start listening if executed directly
if (process.argv[1]?.endsWith("index.js") || process.argv[1]?.endsWith("server.js")) {
  server.listen(PORT, () => {
    console.log(`[AIFA AI Backend] Server running on http://localhost:${PORT}`);
    const hasGemini = !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
    const hasGroq = !!process.env.GROQ_API_KEY;
    console.log(`[AIFA AI Backend] Active Provider: ${hasGemini ? "Gemini" : hasGroq ? "Groq" : "Deterministic Semantic NLU"}`);
  });
}

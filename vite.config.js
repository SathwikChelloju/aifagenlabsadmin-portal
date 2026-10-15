import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import "./server/envLoader.js";
import { processChatWithAi } from "./server/aiService.js";
import {
  authenticateUser,
  verifySessionToken,
  revokeSessionToken,
} from "./server/authService.js";

function assistantApiPlugin() {
  return {
    name: "assistant-api-plugin",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

        // Health endpoint
        if (url.pathname === "/api/health" && req.method === "GET") {
          const hasGemini = !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
          const hasGroq = !!process.env.GROQ_API_KEY;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              status: "ok",
              aiProvider: hasGemini ? "gemini" : hasGroq ? "groq" : "local_semantic_parser",
              hasApiKey: hasGemini || hasGroq,
            })
          );
          return;
        }

        // Authentication: Login endpoint
        if (url.pathname === "/api/auth/login" && req.method === "POST") {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });
          req.on("end", async () => {
            try {
              const payload = body ? JSON.parse(body) : {};
              const result = authenticateUser(payload);
              res.statusCode = result.success ? 200 : 401;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(result));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }

        // Authentication: Session verification endpoint
        if (url.pathname === "/api/auth/session" && req.method === "GET") {
          const authHeader = req.headers.authorization || "";
          const token = authHeader.replace(/^Bearer\s+/i, "").trim();
          const result = verifySessionToken(token);
          res.statusCode = result.valid ? 200 : 401;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify(
              result.valid
                ? { success: true, user: result.user }
                : { success: false, error: result.error }
            )
          );
          return;
        }

        // Authentication: Logout endpoint
        if (url.pathname === "/api/auth/logout" && req.method === "POST") {
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
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ success: true, message: "Logged out successfully" }));
          });
          return;
        }

        // Assistant Intent Interpretation endpoint
        if (url.pathname === "/api/assistant/interpret" && req.method === "POST") {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });
          req.on("end", async () => {
            try {
              const payload = body ? JSON.parse(body) : {};
              const result = await processChatWithAi(payload);
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(result));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), assistantApiPlugin()],
  define: {
    "import.meta.env.VITE_GROQ_API_KEY": JSON.stringify(
      process.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY || ""
    ),
  },
});

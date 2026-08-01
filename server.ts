import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI Client for KAISA Threat Intelligence
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // API Route: Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ONLINE",
      module: "ETERNIVERSE-SEC-GUARD",
      version: "2.4.1-LTS",
      protocol: "DEV-CORE-7.3-SECURE",
      author: "KAISA / MAJSTER-INTEGRATOR",
      timestamp: new Date().toISOString(),
    });
  });

  // API Route: Gemini AI Threat Intelligence Analysis
  app.post("/api/ai-sec-analysis", async (req, res) => {
    try {
      const { threatLogs, alertType, moduleTarget, systemCallTrace } = req.body;

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(200).json({
          success: false,
          fallback: true,
          analysis: {
            severity: "HIGH",
            vector: "BEHAVIORAL_DRIFT",
            summary: "Gemini API key not configured. Fallback heuristic engine active.",
            recommendations: [
              "Isolate target process immediately.",
              "Rotate Ed25519 signing keys.",
              "Enforce strict MFNA re-authentication.",
            ],
            countermeasure: "Quarantine module and initiate immutable ledger audit.",
          },
        });
      }

      const prompt = `
You are KAISA, the AI Security Intelligence Subsystem for ETERNIVERSE-SEC-GUARD (v2.4.1-LTS).
Analyze the following security event and return a JSON evaluation.

Event Context:
- Alert Type: ${alertType || "UNKNOWN_ANOMALY"}
- Target Module: ${moduleTarget || "CORE-SYSTEM"}
- System Call Trace / Log: ${JSON.stringify(systemCallTrace || threatLogs || [])}

Provide your analysis in JSON format with the following fields:
- severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
- vector: concise string describing threat vector (e.g., "QUANTUM_DECRYPTION_PROBE", "BUFFER_OVERFLOW", "BEHAVIORAL_DRIFT")
- summary: detailed 2-3 sentence technical explanation of what occurred and why it was flagged by SentinelNode.
- recommendations: string array of 3 actionable defense actions.
- countermeasure: concise string describing the automated countermeasure executed by SecGuard.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction:
            "You are KAISA, a high-tech AI security intelligence core. Always respond strictly in valid JSON format.",
        },
      });

      const responseText = response.text || "{}";
      let parsed = {};
      try {
        parsed = JSON.parse(responseText.trim());
      } catch (e) {
        parsed = {
          severity: "HIGH",
          vector: "UNPARSED_THREAT",
          summary: responseText,
          recommendations: ["Examine raw logs.", "Isolate module.", "Rotate session keys."],
          countermeasure: "Process isolated under default Zero-Trust rule.",
        };
      }

      return res.json({
        success: true,
        analysis: parsed,
      });
    } catch (error: any) {
      console.error("[SEC-GUARD AI ERROR]", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to analyze threat log.",
      });
    }
  });

  // Vite middleware for development vs production static serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ETERNIVERSE-SEC-GUARD] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

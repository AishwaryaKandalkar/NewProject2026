/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize data inside the server for state retention during session
import { ISSUERS, MARKET_INDICATORS, ALERTS, MY_ACTIONS, GRAPH_NODES, GRAPH_LINKS, MARKET_AI_SUMMARY } from "./src/data.js";

// Keep mutable copies of state so user can toggle/update things in real-time!
let activeIssuers = [...ISSUERS];
let activeAlerts = [...ALERTS];
let activeActions = [...MY_ACTIONS];

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser middleware
  app.use(express.json());

  // --- API ROUTES ---

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // Get all data
  app.get("/api/data", (req, res) => {
    res.json({
      issuers: activeIssuers,
      marketIndicators: MARKET_INDICATORS,
      marketSummary: MARKET_AI_SUMMARY,
      alerts: activeAlerts,
      actions: activeActions,
      graph: {
        nodes: GRAPH_NODES,
        links: GRAPH_LINKS
      }
    });
  });

  // Add to Watchlist / toggle pinning (simulated in-memory)
  app.post("/api/issuers/toggle-priority", (req, res) => {
    const { id, priority } = req.body;
    const issuer = activeIssuers.find(i => i.id === id);
    if (issuer) {
      issuer.priority = priority;
      res.json({ success: true, issuer });
    } else {
      res.status(404).json({ error: "Issuer not found" });
    }
  });

  // Action state modification (Bankers can mark tasks as completed, pending, etc.)
  app.post("/api/actions/update-status", (req, res) => {
    const { id, status } = req.body;
    const action = activeActions.find(a => a.id === id);
    if (action) {
      action.status = status;
      res.json({ success: true, action });
    } else {
      res.status(404).json({ error: "Action task not found" });
    }
  });

  // Create an Opportunity (Bankers can add a new one)
  app.post("/api/issuers/create", (req, res) => {
    const newIssuer = req.body;
    if (!newIssuer.name || !newIssuer.sector) {
      return res.status(400).json({ error: "Missing required fields (name, sector)" });
    }
    const id = newIssuer.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const fullIssuer = {
      id,
      country: "Germany",
      ticker: "NEW GR",
      rating: "BBB Stable",
      opportunityScore: 70,
      trend: "stable" as const,
      suggestedProduct: "Senior Debt (EUR 500M)",
      indicativeWindow: "Q2 2027",
      nextAction: "Perform Credit Review",
      assignedBanker: "Self-Assigned",
      priority: "MEDIUM" as const,
      fundingNeed: 500,
      marketFeasibility: 75,
      dataConfidence: 80,
      relationshipReadiness: 60,
      lastUpdated: new Date().toISOString(),
      debtToEbitda: 2.5,
      ebitdaInterestCoverage: 4.5,
      liquidityPosition: "Adequate",
      refinancingDue: "Q4 2027",
      marketCap: "5.0B EUR",
      aiDrivers: ["Historical similarities to European corporate expansions", "Predictive debt restructuring requirement"],
      positiveSignals: ["Low refinancing rates across sectors"],
      supportingEvidence: ["Active regional trade growth"],
      counterSignals: ["Macro volatility in energy raw materials"],
      missingData: ["Full capital structure details not disclosed"],
      risks: ["Sector regulatory tightening"],
      recommendation: {
        suggestedProduct: "Senior Bond (EUR 500M)",
        indicativeWindow: "Q2 2027",
        illustrativeStructure: "EUR 500M 5-Year Fixed @ MS + 120bps",
        keyTerms: ["General Corporate Purposes", "Standard financial covenants"],
        recommendedTeams: ["DCM Corporates", "Coverage Desk"],
        recommendedNextAction: "Transmit indicative terms sheet"
      },
      scoreBreakdown: {
        relationshipIntelligence: { score: 60, contribution: 25, confidence: 80, evidence: "Cold lead, relationship building needed.", reasoning: "No active history of debt underwriting." },
        creditSignals: { score: 70, contribution: 15, confidence: 90, evidence: "Stable cash flow, moderate debt levels.", reasoning: "Adequate debt service capabilities." },
        marketSignals: { score: 75, contribution: 15, confidence: 85, evidence: "Strong appetite for BBB rated industrial paper.", reasoning: "Favorable investment corridor." },
        financialHealth: { score: 70, contribution: 15, confidence: 90, evidence: "Liquid asset positions are sound.", reasoning: "Solid coverage margins." },
        historicalSimilarity: { score: 65, contribution: 10, confidence: 80, evidence: "Typical BBB refinancing profile.", reasoning: "Consistent with general industrial borrowing." },
        newsIntelligence: { score: 60, contribution: 10, confidence: 75, evidence: "Moderate industry coverage.", reasoning: "Positive sentiment on general industrial output." },
        macroSignals: { score: 70, contribution: 10, confidence: 85, evidence: "Supportive regional growth statistics.", reasoning: "Stable economic foundations." }
      },
      ...newIssuer
    };

    activeIssuers.unshift(fullIssuer);
    
    // Add an alert too
    activeAlerts.unshift({
      id: `alert-${Date.now()}`,
      issuerId: id,
      issuerName: fullIssuer.name,
      type: "EXPANSION",
      title: `New Opportunity Created: ${fullIssuer.name}`,
      message: `Strategic Origination Opportunity logged for ${fullIssuer.name} (${fullIssuer.sector}) with Score of ${fullIssuer.opportunityScore}.`,
      urgency: "MEDIUM",
      timestamp: new Date().toISOString(),
      whyItMatters: "Allows coverage teams to establish immediate contact and beat competitors to capital structures planning.",
      aiReasoning: "Logged by automated platform workflow to coordinate investment banking coverage priorities.",
      suggestedAction: "Assign lead sector banker to draft preliminary company brief."
    });

    res.json({ success: true, issuer: fullIssuer });
  });

  // Copilot Assistant Endpoint (Integrated with Gemini 3.5 Flash server-side)
  app.post("/api/copilot", async (req, res) => {
    try {
      const { message, chatHistory } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Missing prompt message" });
      }

      // Construct a highly detailed system instructions context
      const systemInstruction = `You are SIG, the world-class Strategic Intelligence Graph Copilot deployed inside a Tier-1 European Investment Bank.
You serve Coverage Bankers, Sector Heads, DCM, ECM, and Managing Directors daily to identify and pitch multi-billion Euro corporate deals.
Your style is extremely professional, clear, clinical, objective, and deeply knowledgeable. Avoid flowery consumer language, generic corporate platitudes, or emojis.

Here is the exact state of the bank's client database for European Corporates:
${JSON.stringify(activeIssuers, null, 2)}

Here are the current European Market Indicators:
${JSON.stringify(MARKET_INDICATORS, null, 2)}

Here are the critical Alerts requiring immediate banker attention:
${JSON.stringify(activeAlerts, null, 2)}

Here is the current task queue for banker assignments:
${JSON.stringify(activeActions, null, 2)}

When answering inquiries (e.g., "Why is Airbus ranked #1?", "Draft a pitch briefing for Siemens", "Compare ASML and LVMH convertible bond opportunities", or custom finance queries):
1. Respond with high information density, precise numbers, credit ratings (e.g., A2, Aa3), pricing terms (e.g., MS + 45bps), debt metrics, and specific recommended teams/actions.
2. Structure your answers with clear display sections, bold text for key metrics, and bullet points.
3. Be explainable: Ground all recommendation logic directly in the core data, credit scores, market conditions, and news drivers.
4. Recommend actionable next steps that bankers can take immediately (e.g., 'Advise Chantal Moreau to prepare an ELCM presentation by Thursday morning').
5. Keep your tone elite, authoritative, and helpful, as if writing an internal Managing Director memorandum.`;

      // Structure contents for Gemini API (include previous chat history if provided)
      const contents = [];
      if (chatHistory && Array.isArray(chatHistory)) {
        for (const turn of chatHistory) {
          contents.push({
            role: turn.role === "user" ? "user" : "model",
            parts: [{ text: turn.content }]
          });
        }
      }
      contents.push({
        role: "user",
        parts: [{ text: message }]
      });

      // Call Gemini 3.5 Flash securely
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction,
          temperature: 0.1, // low temperature for precise, fact-based financial calculations
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Copilot Error:", error);
      res.status(500).json({ error: "Gemini server-side evaluation failed", details: error.message });
    }
  });

  // --- VITE DEV/PROD MIDDLEWARE SETUP ---

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
    console.log(`[SIG SERVER] Running securely at http://localhost:${PORT}`);
  });
}

startServer();

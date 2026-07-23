/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { 
  ShieldCheck, 
  Database, 
  HelpCircle, 
  Sparkles, 
  Activity, 
  Coins, 
  Globe, 
  TrendingUp,
  Sliders,
  Percent,
  CheckCircle2,
  Calendar
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { Issuer } from "../types";

interface DataAndSignalsProps {
  issuers: Issuer[];
  onSelectIssuer: (id: string) => void;
}

export default function DataAndSignals({ issuers, onSelectIssuer }: DataAndSignalsProps) {
  const [selectedIssuerId, setSelectedIssuerId] = useState(issuers[0]?.id || "");
  const [activeSignalTab, setActiveSignalTab] = useState<"ALL" | "CREDIT" | "MARKET" | "FINANCIAL" | "EVENTS">("ALL");

  // Get active issuer data
  const issuer = issuers.find(i => i.id === selectedIssuerId) || issuers[0];

  // Convert score breakdown to array for charting
  const breakdownChartData = useMemo(() => {
    if (!issuer) return [];
    return Object.entries(issuer.scoreBreakdown).map(([key, value]) => {
      // Format CamelCase keys to spaced words
      const formattedName = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, str => str.toUpperCase())
        .trim();
      return {
        name: formattedName,
        score: value.score,
        contribution: value.contribution
      };
    });
  }, [issuer]);

  if (!issuer) {
    return <div className="p-4 text-slate-400 font-mono text-xs">No corporate records loaded.</div>;
  }

  // Aggregate signals logs based on active tabs
  const allSignals = [
    {
      id: "sig-1",
      source: "S&P Global ratings feed",
      timestamp: "2026-07-20T08:00:00Z",
      confidence: 99,
      impact: "HIGH",
      category: "CREDIT",
      title: "Credit Outlook Upgraded",
      aiExplanation: "Affirmation of stable underlying cash positions against low debt-to-EBITDA ratios.",
      influence: "+8% score increase multiplier"
    },
    {
      id: "sig-2",
      source: "Bloomberg Credit Swap Monitor",
      timestamp: "2026-07-20T07:15:00Z",
      confidence: 95,
      impact: "MEDIUM",
      category: "MARKET",
      title: "EUR Corporate Spreads Tighten",
      aiExplanation: "Large-cap European industrial corporate credit swaps contracted by 12bps this morning.",
      influence: "+5% score multiplier (Refinancing focus)"
    },
    {
      id: "sig-3",
      source: "S&P Capital IQ Financial database",
      timestamp: "2026-07-19T14:30:00Z",
      confidence: 98,
      impact: "MEDIUM",
      category: "FINANCIAL",
      title: "FCF Yield Exceeds Quota",
      aiExplanation: "Calculated corporate Free Cash Flow generated over past 12 months is 8.2% higher than forecast.",
      influence: "+4% score adjustment"
    },
    {
      id: "sig-4",
      source: "European Mergers Registry",
      timestamp: "2026-07-18T11:00:00Z",
      confidence: 90,
      impact: "CRITICAL",
      category: "EVENTS",
      title: "Strategic Acquisitions Rumors",
      aiExplanation: "Text mining vectors indicate heavy correlation with corporate restructuring activity and Swiss asset registrations.",
      influence: "+15% score leap (M&A structuring potential)"
    },
    {
      id: "sig-5",
      source: "Moody's Rating Service",
      timestamp: "2026-07-16T09:00:00Z",
      confidence: 99,
      impact: "MEDIUM",
      category: "CREDIT",
      title: "Debt Maturities Flagged",
      aiExplanation: "XS129384812 note program enters 6-month pre-maturity window on January 15.",
      influence: "+10% mechanical refinancing weight"
    }
  ];

  const filteredSignals = allSignals.filter(sig => {
    if (activeSignalTab === "ALL") return true;
    return sig.category === activeSignalTab;
  });

  return (
    <div className="space-y-6" id="data-signals-root">
      {/* Top Issuer Selector Panel */}
      <div className="border border-slate-800 bg-slate-950 p-4 rounded flex flex-col md:flex-row justify-between items-center gap-4" id="signals-header-select">
        <div className="flex items-center gap-2.5">
          <Database className="h-5 w-5 text-sky-400" />
          <div>
            <h2 className="text-sm font-sans font-bold text-white uppercase tracking-wider">Signals & Data Intelligence Portal</h2>
            <p className="text-xs text-slate-400 font-sans">Visualizing predictive factor weights and real-time news/credit telemetry signals.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-sans text-slate-400">SELECT ISSUER:</span>
          <select 
            value={selectedIssuerId}
            onChange={(e) => setSelectedIssuerId(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs font-sans text-slate-200 cursor-pointer outline-none"
          >
            {issuers.map(i => (
              <option key={i.id} value={i.id}>{i.name} ({i.ticker})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Score Explainability Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" id="explainability-workspace">
        {/* Left Side: Score Weights Breakdown */}
        <div className="border border-slate-800 bg-slate-950 p-4 rounded lg:col-span-2 flex flex-col" id="explainability-factors-list">
          <div className="flex justify-between items-center mb-3 border-b border-slate-900 pb-2">
            <span className="text-xs font-sans text-slate-300 font-bold uppercase">Mathematical Factors Breakdown ({issuer.name})</span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-sans text-slate-500">AGGREGATED SCORE:</span>
              <span className="text-sm font-mono font-bold text-sky-400">{issuer.opportunityScore}%</span>
            </div>
          </div>

          {/* Score breakdown bar chart */}
          <div className="mb-4 h-[180px] w-full border border-slate-900 bg-slate-900/10 p-3 rounded flex flex-col">
            <span className="text-[10px] font-sans text-slate-400 font-semibold tracking-wide uppercase mb-2 block">Score Dimension Intensity (%)</span>
            <div className="flex-1 min-h-0 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={breakdownChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={9} tickLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155" }} />
                  <Bar dataKey="score" fill="#0284c7" name="Dimension Score (%)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-4 flex-1">
            {Object.entries(issuer.scoreBreakdown).map(([key, value]) => {
              const label = key.replace(/([A-Z])/g, " $1");
              const scoreColor = value.score >= 90 ? "text-emerald-400" : value.score >= 75 ? "text-amber-400" : "text-slate-400";

              return (
                <div key={key} className="p-3 bg-slate-900/40 border border-slate-900 hover:border-slate-850 rounded space-y-2 transition">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 bg-slate-800 text-[8px] text-slate-400 font-mono rounded tracking-wider uppercase">Weight: {value.contribution}%</span>
                      <span className="text-xs font-mono font-bold text-white capitalize">{label}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-mono">
                      <div>Score: <span className={`font-bold ${scoreColor}`}>{value.score}%</span></div>
                      <div>Confidence: <span className="text-sky-400 font-semibold">{value.confidence}%</span></div>
                    </div>
                  </div>

                  {/* Horizontal Bar Visualizer */}
                  <div className="w-full h-1.5 bg-slate-950 rounded overflow-hidden">
                    <div className="h-full bg-sky-500 rounded" style={{ width: `${value.score}%` }}></div>
                  </div>

                  <div className="text-[11px] font-sans text-slate-400 leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                    <div>
                      <span className="text-[9px] font-mono uppercase text-slate-500 block font-semibold">Evidence Metadata</span>
                      <span className="text-slate-300 font-mono text-[10px]">{value.evidence}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono uppercase text-slate-500 block font-semibold">AI Prediction Reasoning</span>
                      <span className="text-slate-300 font-mono text-[10px]">{value.reasoning}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Tabbed Signals Stream */}
        <div className="border border-slate-800 bg-slate-950 p-4 rounded flex flex-col h-[650px]" id="signals-telemetry-feed">
          <div className="mb-3 border-b border-slate-900 pb-2">
            <span className="text-xs font-mono text-slate-400 font-bold uppercase">Real-Time Signals Telemetry</span>
          </div>

          {/* Sub Tabs */}
          <div className="flex flex-wrap gap-1 mb-3.5" id="signals-filter-tabs">
            {(["ALL", "CREDIT", "MARKET", "FINANCIAL", "EVENTS"] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveSignalTab(tab)}
                className={`px-2 py-1 text-[9px] font-mono font-semibold rounded border transition cursor-pointer ${
                  activeSignalTab === tab 
                    ? "bg-slate-800 text-sky-400 border-slate-700" 
                    : "bg-slate-900/40 text-slate-500 border-transparent hover:text-slate-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Log Stream container */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1" id="signals-scroll-box">
            {filteredSignals.map(sig => {
              let tagColor = "bg-sky-950 text-sky-400 border-sky-800/20";
              if (sig.category === "CREDIT") tagColor = "bg-rose-950 text-rose-400 border-rose-800/20";
              else if (sig.category === "EVENTS") tagColor = "bg-purple-950 text-purple-400 border-purple-800/20";
              else if (sig.category === "FINANCIAL") tagColor = "bg-emerald-950 text-emerald-400 border-emerald-800/20";

              return (
                <div key={sig.id} className="border border-slate-900 bg-slate-950/40 p-3 rounded space-y-2 hover:border-slate-800 transition">
                  <div className="flex justify-between items-start gap-2">
                    <span className={`px-1.5 py-0.5 border rounded text-[8px] font-mono font-bold tracking-wider uppercase ${tagColor}`}>
                      {sig.category}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">
                      {new Date(sig.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-mono font-bold text-white">{sig.title}</h4>
                    <p className="text-[11px] font-sans text-slate-400 leading-normal">{sig.aiExplanation}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[10px] font-mono">
                    <span className="text-slate-500 font-semibold uppercase">{sig.source}</span>
                    <span className="text-emerald-400 font-semibold">{sig.influence}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

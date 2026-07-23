/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Settings, 
  Shield, 
  Sliders, 
  Database, 
  UserCheck, 
  Cpu, 
  ToggleLeft, 
  ToggleRight,
  Plus
} from "lucide-react";

export default function Admin() {
  // Score Weights Settings
  const [creditWeight, setCreditWeight] = useState(15);
  const [relationshipWeight, setRelationshipWeight] = useState(25);
  const [marketWeight, setMarketWeight] = useState(15);
  const [newsWeight, setNewsWeight] = useState(10);
  
  // Model settings
  const [selectedModel, setSelectedModel] = useState("gemini-3.5-flash");
  const [temperature, setTemperature] = useState(0.1);

  // Toggle Feature Flags
  const [flags, setFlags] = useState({
    autoBriefDrafting: true,
    realtimeGrounding: true,
    syntheticConvertibles: false,
    outreachAutomations: false
  });

  const handleToggleFlag = (key: keyof typeof flags) => {
    setFlags(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const auditLogs = [
    { timestamp: "2026-07-20T09:40:12Z", user: "aishkandalkar@gmail.com", action: "Triggered Airbus SE Green Bond AI Briefing Draft" },
    { timestamp: "2026-07-20T08:15:00Z", user: "Jean-Pierre Laurent (MD)", action: "Affirmed Lead Coverage status on Airbus SE" },
    { timestamp: "2026-07-20T07:30:22Z", user: "System Scheduler", action: "Completed daily S&P Capital IQ credit ratings database sync" },
    { timestamp: "2026-07-19T18:10:45Z", user: "Chantal Moreau (MD)", action: "Added Kering SA to Peer Comparisons Watchlist" }
  ];

  return (
    <div className="space-y-6" id="admin-root">
      {/* Title block */}
      <div className="border border-slate-800 bg-slate-950 p-4 rounded flex justify-between items-center" id="admin-header">
        <div className="flex items-center gap-2.5">
          <Settings className="h-5 w-5 text-sky-400" />
          <div>
            <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">System Administration & Settings</h2>
            <p className="text-xs text-slate-400 font-sans">Manage predictive algorithms weights, audit security logs, model thresholds, and platform feature toggles.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" id="admin-workspace">
        {/* Scoring weights configuration */}
        <div className="border border-slate-800 bg-slate-950 p-4 rounded space-y-4" id="scoring-weights-panel">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-sky-400 uppercase border-b border-slate-900 pb-2">
            <Sliders className="h-4 w-4" /> Predictive Scoring Weights Adjuster
          </div>
          
          <div className="space-y-4 font-mono text-xs">
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span>Relationship Intelligence Weight</span>
                <span className="font-bold text-sky-400">{relationshipWeight}%</span>
              </div>
              <input 
                type="range" min={5} max={40} value={relationshipWeight} 
                onChange={(e) => setRelationshipWeight(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span>Credit Signals Weight</span>
                <span className="font-bold text-sky-400">{creditWeight}%</span>
              </div>
              <input 
                type="range" min={5} max={40} value={creditWeight} 
                onChange={(e) => setCreditWeight(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span>Market Signals Weight</span>
                <span className="font-bold text-sky-400">{marketWeight}%</span>
              </div>
              <input 
                type="range" min={5} max={40} value={marketWeight} 
                onChange={(e) => setMarketWeight(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span>News Intelligence Weight</span>
                <span className="font-bold text-sky-400">{newsWeight}%</span>
              </div>
              <input 
                type="range" min={5} max={40} value={newsWeight} 
                onChange={(e) => setNewsWeight(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
            </div>

            <div className="p-2 bg-slate-900/60 border border-slate-900 rounded flex justify-between items-center text-[10px]">
              <span className="text-slate-500">AGGREGATED SIGNAL TOTAL WEIGHT:</span>
              <span className="font-bold text-emerald-400">{relationshipWeight + creditWeight + marketWeight + newsWeight + 40}%</span>
            </div>
          </div>
        </div>

        {/* AI Copilot LLM Configurations */}
        <div className="border border-slate-800 bg-slate-950 p-4 rounded space-y-4" id="ai-model-settings">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-sky-400 uppercase border-b border-slate-900 pb-2">
            <Cpu className="h-4 w-4" /> AI Models & Hyperparameters
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div className="space-y-1">
              <label className="text-[9px] uppercase text-slate-500 font-bold block">Assigned LLM Model</label>
              <select 
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 outline-none"
              >
                <option value="gemini-3.5-flash">Gemini 3.5 Flash (Recommended - Realtime)</option>
                <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Heavy reasoning - Paid key required)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span>Temperature (Creativity Threshold)</span>
                <span className="font-bold text-sky-400">{temperature}</span>
              </div>
              <input 
                type="range" min={0} max={1} step={0.1} value={temperature} 
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <span className="text-[9px] text-slate-500 block">Lower temperature ensures highly fact-grounded quantitative evaluations.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" id="admin-sec-grid">
        {/* Security Feature Flags */}
        <div className="border border-slate-800 bg-slate-950 p-4 rounded space-y-4" id="feature-flags-panel">
          <span className="text-xs font-mono text-slate-400 font-bold uppercase block border-b border-slate-900 pb-2">Feature Flag Triggers</span>
          <div className="space-y-3 font-mono text-xs">
            {Object.entries(flags).map(([key, value]) => {
              const label = key.replace(/([A-Z])/g, " $1");
              return (
                <div key={key} className="flex justify-between items-center bg-slate-900/20 p-2 border border-slate-900/60 rounded">
                  <span className="capitalize">{label}</span>
                  <button 
                    onClick={() => handleToggleFlag(key as any)}
                    className="text-slate-300 hover:text-white transition cursor-pointer"
                  >
                    {value ? (
                      <ToggleRight className="h-6 w-6 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="h-6 w-6 text-slate-600" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security Audit logs */}
        <div className="border border-slate-800 bg-slate-950 p-4 rounded lg:col-span-2 space-y-4" id="audit-logs-panel">
          <span className="text-xs font-mono text-slate-400 font-bold uppercase block border-b border-slate-900 pb-2 flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-rose-500" /> Platform Security Audit Logs
          </span>
          <div className="space-y-2.5 overflow-y-auto max-h-[180px] pr-1" id="audit-list">
            {auditLogs.map((log, idx) => (
              <div key={idx} className="border border-slate-900 bg-slate-950/40 p-2.5 rounded text-[11px] font-mono leading-normal flex justify-between gap-4">
                <div>
                  <span className="text-sky-400 font-semibold">[{log.user}]</span> <span className="text-slate-300">{log.action}</span>
                </div>
                <span className="text-[9px] text-slate-500 whitespace-nowrap">{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

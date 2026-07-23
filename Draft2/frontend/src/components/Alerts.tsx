/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Zap,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  MailWarning
} from "lucide-react";
import { Alert } from "../types";

interface AlertsProps {
  alerts: Alert[];
  onSelectIssuer: (id: string) => void;
  onClearAlert: (id: string) => void;
}

export default function Alerts({ alerts, onSelectIssuer, onClearAlert }: AlertsProps) {
  const [activeUrgencyFilter, setActiveUrgencyFilter] = useState<"ALL" | "CRITICAL" | "HIGH" | "MEDIUM">("ALL");
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>("alert-1");

  const filteredAlerts = alerts.filter(alert => {
    if (activeUrgencyFilter === "ALL") return true;
    return alert.urgency === activeUrgencyFilter;
  });

  const toggleExpand = (id: string) => {
    setExpandedAlertId(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-6" id="alerts-root">
      {/* Title block */}
      <div className="border border-slate-800 bg-slate-950 p-4 rounded flex justify-between items-center" id="alerts-header">
        <div className="flex items-center gap-2.5">
          <Bell className="h-5 w-5 text-rose-400 animate-pulse" />
          <div>
            <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Origination Signals Control Center</h2>
            <p className="text-xs text-slate-400 font-sans">Automated AI warning feeds capturing market liquidity developments, corporate defaults risks, and rating shifts.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 font-mono text-xs">
          <span>URGENCY FILTER:</span>
          <div className="flex bg-slate-900 rounded p-0.5 border border-slate-800" id="urgency-tabs">
            {["ALL", "CRITICAL", "HIGH", "MEDIUM"].map((urg) => (
              <button 
                key={urg}
                onClick={() => setActiveUrgencyFilter(urg as any)}
                className={`px-2 py-0.5 text-[9px] font-mono rounded transition cursor-pointer ${
                  activeUrgencyFilter === urg ? "bg-slate-800 text-sky-400 font-bold" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {urg}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredAlerts.length === 0 ? (
        <div className="border border-slate-900 bg-slate-950/40 p-10 rounded text-center" id="alerts-empty">
          <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase">All Signals Clear</h3>
          <p className="text-xs text-slate-500 font-sans mt-1">
            No unresolved high-priority structural anomalies flagged in your monitored client pool.
          </p>
        </div>
      ) : (
        <div className="space-y-3" id="alerts-list">
          {filteredAlerts.map(alert => {
            const isExpanded = expandedAlertId === alert.id;
            
            let urgencyBadge = "bg-rose-950 text-rose-400 border-rose-800/30";
            if (alert.urgency === "HIGH") urgencyBadge = "bg-amber-950 text-amber-400 border-amber-800/30";
            else if (alert.urgency === "MEDIUM") urgencyBadge = "bg-slate-900 text-slate-400 border-slate-800/30";

            return (
              <div 
                key={alert.id}
                className="border border-slate-800 bg-slate-950 rounded overflow-hidden"
              >
                {/* Expandable top block bar */}
                <div 
                  onClick={() => toggleExpand(alert.id)}
                  className="p-3.5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-900/30 transition cursor-pointer"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white uppercase">{alert.issuerName}</span>
                      <span className={`px-1.5 py-0.5 border rounded text-[8px] font-mono font-bold tracking-wider uppercase ${urgencyBadge}`}>
                        {alert.urgency}
                      </span>
                      <span className="px-1.5 py-0.5 bg-slate-900 text-slate-400 rounded text-[8px] font-mono font-semibold uppercase">{alert.type}</span>
                    </div>
                    <h3 className="text-xs font-mono font-bold text-slate-200">{alert.title}</h3>
                    <p className="text-[11px] text-slate-400 leading-normal line-clamp-1">{alert.message}</p>
                  </div>

                  <div className="flex items-center gap-4 font-mono text-[10px] text-slate-500 w-full md:w-auto justify-between md:justify-end">
                    <span>{new Date(alert.timestamp).toLocaleDateString()}</span>
                    <button className="p-1 hover:text-white transition cursor-pointer">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Collapsible content area */}
                {isExpanded && (
                  <div className="border-t border-slate-900 bg-slate-950/60 p-4 space-y-4 text-xs font-mono">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Why it matters */}
                      <div className="space-y-1.5 p-3 bg-slate-900/30 border border-slate-900 rounded">
                        <span className="text-[9px] uppercase text-rose-400 font-bold flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Why This Matters
                        </span>
                        <p className="text-slate-300 font-sans leading-relaxed text-xs">
                          {alert.whyItMatters}
                        </p>
                      </div>

                      {/* AI Reasoning */}
                      <div className="space-y-1.5 p-3 bg-slate-900/30 border border-slate-900 rounded">
                        <span className="text-[9px] uppercase text-sky-400 font-bold flex items-center gap-1">
                          <Zap className="h-3 w-3" /> AI Predictive Reasoning
                        </span>
                        <p className="text-slate-300 font-sans leading-relaxed text-xs">
                          {alert.aiReasoning}
                        </p>
                      </div>
                    </div>

                    {/* Suggested Action Terms */}
                    <div className="space-y-1.5 border-t border-slate-900 pt-3">
                      <span className="text-[10px] uppercase text-emerald-400 font-bold block">Recommended Advisory Play</span>
                      <p className="text-slate-200 font-sans text-xs leading-relaxed font-semibold">
                        {alert.suggestedAction}
                      </p>
                    </div>

                    <div className="flex gap-2 justify-end border-t border-slate-900 pt-3">
                      <button 
                        onClick={() => onSelectIssuer(alert.issuerId)}
                        className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded transition flex items-center gap-1 cursor-pointer"
                      >
                        Open Issuer Explorer
                      </button>
                      <button 
                        onClick={() => onClearAlert(alert.id)}
                        className="px-2.5 py-1.5 bg-emerald-700/80 hover:bg-emerald-600 text-white rounded transition flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> MARK RESOLVED
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

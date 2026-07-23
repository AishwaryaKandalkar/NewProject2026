/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  TrendingUp as Stable,
  Info, 
  Activity, 
  Globe,
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { MarketIndicator } from "../types";

interface MarketMonitorProps {
  indicators: MarketIndicator[];
  summary: string;
}

export default function MarketMonitor({ indicators, summary }: MarketMonitorProps) {
  // Extract percentage yield benchmarks for a comparative visualization
  const yieldBenchmarksData = useMemo(() => {
    return indicators
      .filter(ind => ind.value.includes("%"))
      .map(ind => ({
        name: ind.name,
        yieldValue: parseFloat(ind.value.replace("%", ""))
      }));
  }, [indicators]);

  const COLORS = ["#0284c7", "#10b981", "#f59e0b", "#6366f1", "#ec4899"];

  return (
    <div className="space-y-6" id="market-monitor-root">
      {/* Title Header */}
      <div className="border border-slate-800 bg-slate-950 p-4 rounded flex justify-between items-center" id="market-header">
        <div className="flex items-center gap-2.5">
          <Activity className="h-5 w-5 text-sky-400" />
          <div>
            <h2 className="text-sm font-sans font-bold text-white uppercase tracking-wider">European Sovereign & Credit Market Monitor</h2>
            <p className="text-xs text-slate-400 font-sans">Underlying liquidity tracking indices driving corporate capital structure pricing and swap-arbitrage windows.</p>
          </div>
        </div>
      </div>

      {/* AI Market Receptivity Summary */}
      <div className="border border-slate-800 bg-slate-950 p-4.5 rounded space-y-2" id="ai-market-summary-widget">
        <span className="text-xs font-sans font-bold text-sky-400 uppercase tracking-wide flex items-center gap-1">
          ✦ AI Consolidated Market Summary
        </span>
        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          {summary}
        </p>
      </div>

      {/* Yield comparative bar chart */}
      {yieldBenchmarksData.length > 0 && (
        <div className="border border-slate-800 bg-slate-950 p-4 rounded flex flex-col h-[220px]">
          <span className="text-xs font-sans text-slate-400 font-semibold uppercase mb-3 flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-sky-400" /> Key Yield & Sovereign Benchmarks Comparison (%)
          </span>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yieldBenchmarksData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={9} tickLine={false} domain={[0, 4]} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={9} tickLine={false} width={100} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155" }} />
                <Bar dataKey="yieldValue" radius={[0, 2, 2, 0]} name="Yield (%)">
                  {yieldBenchmarksData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Grid of indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3" id="indicators-grid">
        {indicators.map(ind => {
          let trendColor = "text-slate-400";
          let Icon = Info;
          if (ind.trend === "up") {
            trendColor = "text-emerald-400";
            Icon = TrendingUp;
          } else if (ind.trend === "down") {
            trendColor = "text-rose-400";
            Icon = TrendingDown;
          }

          return (
            <div 
              key={ind.id}
              className="border border-slate-800 bg-slate-950 p-4 rounded space-y-3 hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-xs font-mono font-bold text-white">{ind.name}</h3>
                  <div className="flex items-center gap-1.5 font-mono text-xs">
                    <span className="text-white font-bold">{ind.value}</span>
                    <span className={`text-[10px] font-semibold flex items-center gap-0.5 ${trendColor}`}>
                      <Icon className="h-3 w-3" /> {ind.change}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] bg-slate-900/40 p-2.5 border border-slate-900 rounded text-slate-400 font-sans leading-relaxed">
                  <span className="text-[9px] font-mono uppercase text-slate-500 block font-semibold mb-1">Origination Influence</span>
                  {ind.influence}
                </div>
              </div>

              <div className="text-[8px] text-slate-500 font-mono text-right mt-2 border-t border-slate-900/80 pt-1.5 uppercase">
                Grounded source: Bloomberg Terminal • S&P Global
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

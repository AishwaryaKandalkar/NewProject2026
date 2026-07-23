/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  TrendingUp, 
  AlertCircle, 
  Clock, 
  Award, 
  BarChart3, 
  PlusCircle, 
  FileText, 
  Eye, 
  Share2, 
  ChevronRight,
  ShieldCheck,
  Building2,
  Calendar
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";
import { Issuer, Alert, MyAction } from "../types";

interface HomeViewProps {
  issuers: Issuer[];
  alerts: Alert[];
  actions: MyAction[];
  onSelectIssuer: (id: string) => void;
  onNavigate: (view: string) => void;
}

export default function HomeView({ issuers, alerts, actions, onSelectIssuer, onNavigate }: HomeViewProps) {
  // Compute real statistics from issuers list
  const activeOpportunities = issuers.length;
  const highPriorityCount = issuers.filter(i => i.priority === "CRITICAL" || i.priority === "HIGH").length;
  const requireAttentionCount = issuers.filter(i => i.relationshipReadiness < 80).length;
  const averageScore = Math.round(issuers.reduce((acc, curr) => acc + curr.opportunityScore, 0) / issuers.length);
  const potentialPipelineVal = issuers.reduce((acc, curr) => acc + curr.fundingNeed, 0); // millions
  
  // Static metrics requested
  const mandatesWon = 14; 
  const avgConfidence = 89; // %
  const createdTodayCount = 2;

  // Chart data 1: Opportunity Trend
  const trendData = [
    { month: "Jan", opportunities: 12, avgScore: 78, volume: 5.4 },
    { month: "Feb", opportunities: 15, avgScore: 80, volume: 6.8 },
    { month: "Mar", opportunities: 18, avgScore: 82, volume: 7.2 },
    { month: "Apr", opportunities: 22, avgScore: 81, volume: 9.1 },
    { month: "May", opportunities: 26, avgScore: 84, volume: 11.5 },
    { month: "Jun", opportunities: 29, avgScore: 85, volume: 12.8 },
    { month: "Jul", opportunities: activeOpportunities + 24, avgScore: averageScore, volume: (potentialPipelineVal/1000) + 12 }
  ];

  // Chart data 2: Sector Distribution
  const sectorData = issuers.reduce((acc: any[], curr) => {
    const existing = acc.find(item => item.name === curr.sector);
    if (existing) {
      existing.value += 1;
      existing.funding += curr.fundingNeed;
    } else {
      acc.push({ name: curr.sector, value: 1, funding: curr.fundingNeed });
    }
    return acc;
  }, []);

  // Chart data 3: Country Distribution
  const countryData = issuers.reduce((acc: any[], curr) => {
    const existing = acc.find(item => item.name === curr.country);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: curr.country, value: 1 });
    }
    return acc;
  }, []);

  // Chart data 4: Product Mix
  const productData = [
    { name: "Green Bond", value: issuers.filter(i => i.suggestedProduct.toLowerCase().includes("green")).length },
    { name: "Convertible", value: issuers.filter(i => i.suggestedProduct.toLowerCase().includes("convertible")).length },
    { name: "Refinancing", value: issuers.filter(i => i.suggestedProduct.toLowerCase().includes("refinance") || i.suggestedProduct.toLowerCase().includes("structure")).length },
    { name: "Senior Bond", value: issuers.filter(i => i.suggestedProduct.toLowerCase().includes("senior")).length },
    { name: "Other Credit", value: 1 }
  ];

  // Chart data 5: Top Corporate Targets (Opportunity Score & Funding)
  const topTargetsData = issuers
    .map(i => ({
      name: i.ticker,
      score: i.opportunityScore,
      funding: i.fundingNeed,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const COLORS = ["#0284c7", "#10b981", "#f59e0b", "#6366f1", "#ec4899", "#14b8a6"];

  return (
    <div className="space-y-6" id="home-view-container">
      {/* Executive Summary Pitch */}
      <div className="border border-slate-800 bg-slate-950/80 p-4 rounded backdrop-blur-sm" id="exec-summary-banner">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-sm font-mono tracking-wider text-sky-400 font-semibold uppercase">EXECUTIVE BRIEFING</h2>
            <p className="text-sm text-slate-300 mt-1 max-w-4xl font-sans">
              Market liquidity conditions are <span className="text-emerald-400 font-medium">highly receptive</span> for European corporate debt structures. High-grade credit spreads continue to tighten, yielding prime origination opportunities for <span className="text-white font-medium">Airbus SE</span> and <span className="text-white font-medium">Siemens AG</span> ahead of heavy Q4 capex requirements and capital restructuring timelines. Keep monitoring target-level alerts.
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => onNavigate("Opportunity Radar")}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-mono font-medium transition flex items-center gap-1.5 cursor-pointer"
            >
              <TrendingUp className="h-3.5 w-3.5" /> REVIEW OPPORTUNITIES
            </button>
            <button 
              onClick={() => onNavigate("Graph View")}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-mono transition flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5" /> GRAPH EXPLORER
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3" id="kpi-cards-grid">
        <div className="border border-slate-800 bg-slate-950 p-3.5 rounded flex flex-col justify-between" id="kpi-active-opps">
          <div className="flex justify-between items-start text-slate-400">
            <span className="text-[10px] font-sans tracking-wider uppercase font-semibold text-slate-400">Active Opportunities</span>
            <BarChart3 className="h-4 w-4 text-sky-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-mono font-bold text-white">{activeOpportunities}</div>
            <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1 font-sans">
              <span className="text-emerald-400 font-medium">+4 new</span> this week
            </div>
          </div>
        </div>

        <div className="border border-slate-800 bg-slate-950 p-3.5 rounded flex flex-col justify-between" id="kpi-high-priority">
          <div className="flex justify-between items-start text-slate-400">
            <span className="text-[10px] font-sans tracking-wider uppercase font-semibold text-slate-400">High Priority</span>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-mono font-bold text-amber-400">{highPriorityCount}</div>
            <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1 font-sans">
              <span className="text-amber-400 font-medium">Critical focus</span> allocated
            </div>
          </div>
        </div>

        <div className="border border-slate-800 bg-slate-950 p-3.5 rounded flex flex-col justify-between" id="kpi-require-attention">
          <div className="flex justify-between items-start text-slate-400">
            <span className="text-[10px] font-sans tracking-wider uppercase font-semibold text-slate-400">Need Engagement</span>
            <Clock className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-mono font-bold text-emerald-400">{requireAttentionCount}</div>
            <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1 font-sans">
              Relationship score &lt; 80%
            </div>
          </div>
        </div>

        <div className="border border-slate-800 bg-slate-950 p-3.5 rounded flex flex-col justify-between" id="kpi-created-today">
          <div className="flex justify-between items-start text-slate-400">
            <span className="text-[10px] font-sans tracking-wider uppercase font-semibold text-slate-400">Created Today</span>
            <PlusCircle className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-mono font-bold text-purple-400">{createdTodayCount}</div>
            <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1 font-sans">
              Self & AI generated flags
            </div>
          </div>
        </div>

        <div className="border border-slate-800 bg-slate-950 p-3.5 rounded flex flex-col justify-between" id="kpi-avg-score">
          <div className="flex justify-between items-start text-slate-400">
            <span className="text-[10px] font-sans tracking-wider uppercase font-semibold text-slate-400">Avg Opportunity Score</span>
            <TrendingUp className="h-4 w-4 text-sky-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-mono font-bold text-white">{averageScore}%</div>
            <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1 font-sans">
              Threshold benchmark 75%
            </div>
          </div>
        </div>

        <div className="border border-slate-800 bg-slate-950 p-3.5 rounded flex flex-col justify-between" id="kpi-mandates-won">
          <div className="flex justify-between items-start text-slate-400">
            <span className="text-[10px] font-sans tracking-wider uppercase font-semibold text-slate-400">Mandates Won YTD</span>
            <Award className="h-4 w-4 text-yellow-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-mono font-bold text-white">{mandatesWon}</div>
            <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1 font-sans">
              Target quota 20 deals
            </div>
          </div>
        </div>

        <div className="border border-slate-800 bg-slate-950 p-3.5 rounded flex flex-col justify-between" id="kpi-pipeline-value">
          <div className="flex justify-between items-start text-slate-400">
            <span className="text-[10px] font-sans tracking-wider uppercase font-semibold text-slate-400">Potential Pipeline</span>
            <Building2 className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-mono font-bold text-sky-400">EUR {potentialPipelineVal / 1000}B</div>
            <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1 font-sans">
              Total aggregated capacity
            </div>
          </div>
        </div>

        <div className="border border-slate-800 bg-slate-950 p-3.5 rounded flex flex-col justify-between" id="kpi-avg-confidence">
          <div className="flex justify-between items-start text-slate-400">
            <span className="text-[10px] font-sans tracking-wider uppercase font-semibold text-slate-400">Model Confidence</span>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-mono font-bold text-emerald-400">{avgConfidence}%</div>
            <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1 font-sans">
              Backtested predictive accuracy
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" id="home-charts-grid">
        {/* Opportunity Trend Line */}
        <div className="border border-slate-800 bg-slate-950 p-4 rounded lg:col-span-2 flex flex-col h-[300px]" id="chart-opp-trend">
          <span className="text-xs font-mono text-slate-400 font-semibold tracking-wide uppercase mb-3 block">Opportunity & Deal Volume Trend</span>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorOpps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={10} fontClassName="font-mono" tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} fontClassName="font-mono" tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155" }} 
                  labelStyle={{ fontFamily: "monospace", color: "#94a3b8" }}
                />
                <Area type="monotone" dataKey="opportunities" stroke="#0284c7" fillOpacity={1} fill="url(#colorOpps)" strokeWidth={2} name="Active Opportunities" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Allocation Pie */}
        <div className="border border-slate-800 bg-slate-950 p-4 rounded flex flex-col h-[300px]" id="chart-sector-mix">
          <span className="text-xs font-mono text-slate-400 font-semibold tracking-wide uppercase mb-3 block">Sector Pipeline Allocation</span>
          <div className="flex-1 w-full min-h-0 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="funding"
                >
                  {sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`EUR ${value}M`, "Pipeline Value"]}
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155" }} 
                />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{ fontSize: 9, fontFamily: "monospace", color: "#94a3b8" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" id="home-sec-grid">
        {/* Funding Product Mix & Refinancing Timeline */}
        <div className="border border-slate-800 bg-slate-950 p-4 rounded flex flex-col h-[280px]" id="chart-product-mix">
          <span className="text-xs font-sans text-slate-400 font-semibold tracking-wide uppercase mb-3 block">Funding Product Distribution</span>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} width={80} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155" }} />
                <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} name="Deals Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Origination Targets Chart */}
        <div className="border border-slate-800 bg-slate-950 p-4 rounded flex flex-col h-[280px]" id="chart-top-targets">
          <span className="text-xs font-sans text-slate-400 font-semibold tracking-wide uppercase mb-3 block">Top Targets: Score vs. Funding</span>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topTargetsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155" }} 
                  labelStyle={{ fontFamily: "sans-serif", color: "#94a3b8" }}
                />
                <Legend wrapperStyle={{ fontSize: 9 }} />
                <Bar dataKey="score" fill="#0284c7" radius={[2, 2, 0, 0]} name="Score (%)" />
                <Bar dataKey="funding" fill="#f59e0b" radius={[2, 2, 0, 0]} name="Funding (M EUR)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Meetings & Task Summary */}
        <div className="border border-slate-800 bg-slate-950 p-4 rounded flex flex-col h-[280px] overflow-hidden" id="task-queue-widget">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-sans text-slate-400 font-semibold tracking-wide uppercase">Priority Work Queue</span>
            <button onClick={() => onNavigate("My Actions")} className="text-[10px] font-sans text-sky-400 hover:underline flex items-center cursor-pointer">
              View All <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {actions.slice(0, 4).map((action) => (
              <div key={action.id} className="border border-slate-900 bg-slate-950/40 p-2.5 rounded flex justify-between items-center hover:border-slate-800 transition">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded text-[8px] font-mono tracking-wider font-semibold uppercase">{action.type}</span>
                    <span className="text-[11px] font-mono font-semibold text-slate-200">{action.issuerName}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{action.title}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-1 font-mono">
                  <span className="text-[9px] text-slate-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {action.dueDate}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-semibold ${
                    action.status === "COMPLETED" ? "bg-emerald-950 text-emerald-400 border border-emerald-800/30" : "bg-sky-950 text-sky-400 border border-sky-800/30"
                  }`}>
                    {action.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Alerts and Viewed Issuers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" id="home-viewed-alerts">
        {/* Recent Alerts */}
        <div className="border border-slate-800 bg-slate-950 p-4 rounded lg:col-span-2" id="recent-alerts-panel">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-mono text-slate-400 font-semibold tracking-wide uppercase">Critical Origination Alerts</span>
            <button onClick={() => onNavigate("Alerts")} className="text-[10px] font-mono text-sky-400 hover:underline flex items-center cursor-pointer">
              Manage Alerts <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-2">
            {alerts.slice(0, 3).map((alert) => (
              <div 
                key={alert.id} 
                onClick={() => onSelectIssuer(alert.issuerId)}
                className="border-l-2 border-l-rose-500 border-y border-r border-slate-900 bg-slate-950/60 hover:bg-slate-900/60 p-3 rounded-r transition cursor-pointer flex justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-white">{alert.issuerName}</span>
                    <span className="px-1.5 py-0.5 bg-rose-950 text-rose-400 rounded text-[8px] font-mono font-semibold tracking-wide uppercase">{alert.type}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-semibold">{alert.title}</p>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{alert.message}</p>
                </div>
                <div className="text-right flex flex-col justify-between items-end font-mono">
                  <span className="text-[9px] text-slate-500">{new Date(alert.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  <span className="text-[10px] text-rose-400 hover:underline flex items-center">Analyze <ChevronRight className="h-3 w-3" /></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Viewed Issuers */}
        <div className="border border-slate-800 bg-slate-950 p-4 rounded" id="recent-issuers-panel">
          <span className="text-xs font-mono text-slate-400 font-semibold tracking-wide uppercase mb-3 block">Predictive Deal Radar</span>
          <div className="space-y-2">
            {issuers.slice(0, 4).map((issuer) => (
              <div 
                key={issuer.id} 
                onClick={() => onSelectIssuer(issuer.id)}
                className="p-2.5 border border-slate-900 hover:border-slate-800 bg-slate-950/40 rounded flex justify-between items-center transition cursor-pointer"
              >
                <div>
                  <div className="text-[11px] font-mono font-bold text-white">{issuer.name}</div>
                  <div className="text-[10px] text-slate-400">{issuer.sector} • {issuer.ticker}</div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xs font-bold text-sky-400">{issuer.opportunityScore}%</div>
                  <span className={`text-[8px] font-semibold px-1 py-0.2 rounded ${
                    issuer.priority === "CRITICAL" ? "bg-rose-950 text-rose-400" : "bg-amber-950 text-amber-400"
                  }`}>
                    {issuer.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { 
  SlidersHorizontal, 
  Search, 
  Download, 
  UserPlus, 
  FileEdit, 
  ExternalLink, 
  ArrowUpDown, 
  TrendingUp, 
  CheckCircle2,
  TrendingDown,
  RefreshCw,
  Plus
} from "lucide-react";
import { Issuer } from "../types";

interface OpportunityRadarProps {
  issuers: Issuer[];
  onSelectIssuer: (id: string) => void;
  onAssignBanker: (issuerId: string) => void;
  onGenerateBrief: (issuerId: string) => void;
  onCreateOpportunity: (newOpp: Partial<Issuer>) => void;
}

export default function OpportunityRadar({ 
  issuers, 
  onSelectIssuer, 
  onAssignBanker, 
  onGenerateBrief,
  onCreateOpportunity
}: OpportunityRadarProps) {
  // Filters State
  const [selectedUniverse, setSelectedUniverse] = useState("All");
  const [selectedView, setSelectedView] = useState("All");
  const [selectedCurrency, setSelectedCurrency] = useState("EUR");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Table Sorting State
  const [sortField, setSortField] = useState<keyof Issuer>("opportunityScore");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // New Opportunity Modal/Form toggle
  const [showAddModal, setShowAddModal] = useState(false);
  const [newOppName, setNewOppName] = useState("");
  const [newOppSector, setNewOppSector] = useState("Aerospace & Defense");
  const [newOppScore, setNewOppScore] = useState(75);
  const [newOppPriority, setNewOppPriority] = useState<"CRITICAL" | "HIGH" | "MEDIUM" | "LOW">("MEDIUM");

  // Handle Opportunity submission
  const handleCreateOpp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOppName.trim()) return;

    onCreateOpportunity({
      name: newOppName,
      sector: newOppSector,
      opportunityScore: Number(newOppScore),
      priority: newOppPriority,
      trend: "stable",
      lastUpdated: new Date().toISOString()
    });

    // Reset and close
    setNewOppName("");
    setNewOppSector("Aerospace & Defense");
    setNewOppScore(75);
    setNewOppPriority("MEDIUM");
    setShowAddModal(false);
  };

  // Filtered issuers
  const filteredIssuers = useMemo(() => {
    return issuers.filter(issuer => {
      // 1. Universe filter
      if (selectedUniverse !== "All") {
        if (selectedUniverse === "Investment Grade" && !["A1", "A2", "Aa2", "Aa3", "A Stable"].some(r => issuer.rating.includes(r))) return false;
        if (selectedUniverse === "High Yield" && issuer.rating.includes("B")) return false; // simple filter
        if (selectedUniverse === "Financial Institutions" && issuer.sector.includes("Financial")) return false;
        if (selectedUniverse === "Industrials" && !["Industrial Conglomerate", "Aerospace & Defense"].includes(issuer.sector)) return false;
      }

      // 2. Product View filter
      if (selectedView !== "All") {
        if (selectedView === "Green Bond" && !issuer.suggestedProduct.toLowerCase().includes("green")) return false;
        if (selectedView === "Convertible" && !issuer.suggestedProduct.toLowerCase().includes("convertible")) return false;
        if (selectedView === "Refinancing Bond" && !issuer.suggestedProduct.toLowerCase().includes("refinance")) return false;
      }

      // 3. Search query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesName = issuer.name.toLowerCase().includes(query);
        const matchesSector = issuer.sector.toLowerCase().includes(query);
        const matchesTicker = issuer.ticker.toLowerCase().includes(query);
        const matchesCountry = issuer.country.toLowerCase().includes(query);
        if (!matchesName && !matchesSector && !matchesTicker && !matchesCountry) return false;
      }

      return true;
    });
  }, [issuers, selectedUniverse, selectedView, searchQuery]);

  // Sorted issuers
  const sortedIssuers = useMemo(() => {
    const sorted = [...filteredIssuers];
    sorted.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // Handle nested values if needed
      if (typeof valA === "string") {
        valA = valA.toLowerCase();
        valB = (valB as string).toLowerCase();
      }

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredIssuers, sortField, sortDirection]);

  const handleSort = (field: keyof Issuer) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Mock Export CSV action
  const handleExportCSV = () => {
    const headers = ["Rank", "Issuer", "Sector", "Country", "Rating", "Score", "Funding Need (M EUR)", "Product", "Window", "Next Action"];
    const rows = sortedIssuers.map((item, index) => [
      index + 1,
      item.name,
      item.sector,
      item.country,
      item.rating,
      item.opportunityScore,
      item.fundingNeed,
      item.suggestedProduct,
      item.indicativeWindow,
      item.nextAction
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SIG_Opportunity_Radar_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6" id="opportunity-radar-root">
      {/* Top Filter Bar */}
      <div className="border border-slate-800 bg-slate-950 p-4 rounded flex flex-col md:flex-row flex-wrap items-center justify-between gap-4" id="filters-container">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 font-semibold uppercase">
            <SlidersHorizontal className="h-3.5 w-3.5 text-sky-400" /> Universe:
          </div>
          <div className="flex bg-slate-900 rounded p-0.5 border border-slate-800" id="universe-filter-group">
            {["All", "Investment Grade", "High Yield", "Industrials"].map((univ) => (
              <button 
                key={univ}
                onClick={() => setSelectedUniverse(univ)}
                className={`px-2.5 py-1 text-[10px] font-mono font-medium rounded transition cursor-pointer ${
                  selectedUniverse === univ ? "bg-sky-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                {univ}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 font-semibold uppercase ml-2">
            View:
          </div>
          <select 
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs font-mono text-slate-200 outline-none cursor-pointer"
          >
            <option value="All">All Products</option>
            <option value="Refinancing Bond">Refinancing Bonds</option>
            <option value="Green Bond">Green Bonds</option>
            <option value="Convertible">Convertible Debt</option>
          </select>

          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 font-semibold uppercase ml-2">
            Currency:
          </div>
          <div className="flex bg-slate-900 rounded p-0.5 border border-slate-800" id="currency-filter-group">
            {["EUR", "GBP", "USD", "CHF"].map((curr) => (
              <button 
                key={curr}
                onClick={() => setSelectedCurrency(curr)}
                className={`px-2 py-0.5 text-[10px] font-mono rounded transition cursor-pointer ${
                  selectedCurrency === curr ? "bg-slate-800 text-sky-400 font-bold" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto" id="search-radar-group">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Filter by Name, Ticker, Country..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-800 rounded pl-8 pr-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 outline-none focus:border-sky-500 transition"
            />
          </div>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs rounded transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" /> CREATE DEAL
          </button>
        </div>
      </div>

      {/* KPI Top Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3" id="radar-kpi-bar">
        <div className="border border-slate-800 bg-slate-950 p-3.5 rounded">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Top Rated Opportunity</div>
          <div className="text-xl font-mono font-bold text-white mt-1">Airbus SE</div>
          <div className="text-[10px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
            Score: <span className="font-bold">94%</span> (Critical urgency)
          </div>
        </div>
        <div className="border border-slate-800 bg-slate-950 p-3.5 rounded">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">High Priority Pipeline</div>
          <div className="text-xl font-mono font-bold text-amber-500 mt-1">{issuers.filter(i => i.priority === "CRITICAL" || i.priority === "HIGH").length} Issuers</div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">
            Active underwriter mandate risk
          </div>
        </div>
        <div className="border border-slate-800 bg-slate-950 p-3.5 rounded">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Total Filtered Universe</div>
          <div className="text-xl font-mono font-bold text-white mt-1">{filteredIssuers.length} Corporates</div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">
            Out of {issuers.length} total monitored
          </div>
        </div>
        <div className="border border-slate-800 bg-slate-950 p-3.5 rounded">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Pipeline Freshness</div>
          <div className="text-xl font-mono font-bold text-emerald-400 mt-1">100% Real-time</div>
          <div className="text-[10px] font-mono text-slate-400 mt-1 flex items-center gap-1">
            <RefreshCw className="h-3 w-3 animate-spin text-emerald-500" /> Grounded in news feeds
          </div>
        </div>
      </div>

      {/* Main Enterprise Opportunity Table */}
      <div className="border border-slate-800 bg-slate-950 rounded overflow-hidden" id="enterprise-table-panel">
        <div className="border-b border-slate-800 bg-slate-900/60 p-3 flex justify-between items-center" id="table-header">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">ENTERPRISE ORIGINATION REGISTRY</span>
            <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-[10px] font-mono">{sortedIssuers.length} records matched</span>
          </div>
          <button 
            onClick={handleExportCSV}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-mono transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" /> EXPORT CSV
          </button>
        </div>

        <div className="overflow-x-auto" id="opportunity-table-container">
          <table className="w-full text-left border-collapse font-mono" id="opportunity-table">
            <thead>
              <tr className="bg-slate-900/30 text-slate-400 text-[10px] uppercase tracking-wider border-b border-slate-800">
                <th className="p-3 font-semibold select-none">Rank</th>
                <th className="p-3 font-semibold select-none cursor-pointer hover:text-white" onClick={() => handleSort("name")}>
                  Issuer <ArrowUpDown className="inline h-3 w-3 ml-0.5 text-slate-500" />
                </th>
                <th className="p-3 font-semibold select-none cursor-pointer hover:text-white" onClick={() => handleSort("sector")}>
                  Sector <ArrowUpDown className="inline h-3 w-3 ml-0.5 text-slate-500" />
                </th>
                <th className="p-3 font-semibold select-none cursor-pointer hover:text-white" onClick={() => handleSort("country")}>
                  Country <ArrowUpDown className="inline h-3 w-3 ml-0.5 text-slate-500" />
                </th>
                <th className="p-3 font-semibold select-none cursor-pointer hover:text-white" onClick={() => handleSort("rating")}>
                  Rating <ArrowUpDown className="inline h-3 w-3 ml-0.5 text-slate-500" />
                </th>
                <th className="p-3 font-semibold text-center select-none cursor-pointer hover:text-white" onClick={() => handleSort("opportunityScore")}>
                  Score <ArrowUpDown className="inline h-3 w-3 ml-0.5 text-slate-500" />
                </th>
                <th className="p-3 font-semibold text-right select-none cursor-pointer hover:text-white" onClick={() => handleSort("fundingNeed")}>
                  Funding Need <ArrowUpDown className="inline h-3 w-3 ml-0.5 text-slate-500" />
                </th>
                <th className="p-3 font-semibold text-center select-none cursor-pointer hover:text-white" onClick={() => handleSort("marketFeasibility")}>
                  Feasibility <ArrowUpDown className="inline h-3 w-3 ml-0.5 text-slate-500" />
                </th>
                <th className="p-3 font-semibold text-center select-none cursor-pointer hover:text-white" onClick={() => handleSort("dataConfidence")}>
                  Confidence <ArrowUpDown className="inline h-3 w-3 ml-0.5 text-slate-500" />
                </th>
                <th className="p-3 font-semibold select-none">Suggested Product</th>
                <th className="p-3 font-semibold text-right select-none">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-xs">
              {sortedIssuers.map((issuer, idx) => (
                <tr 
                  key={issuer.id} 
                  className="hover:bg-slate-900/40 transition-colors group align-middle"
                >
                  <td className="p-3 text-slate-500 font-bold font-mono">#{idx + 1}</td>
                  <td className="p-3">
                    <div 
                      onClick={() => onSelectIssuer(issuer.id)}
                      className="font-bold text-white hover:text-sky-400 transition cursor-pointer flex items-center gap-1.5"
                    >
                      {issuer.name}
                      <span className="text-[9px] text-slate-400 font-normal">({issuer.ticker})</span>
                    </div>
                  </td>
                  <td className="p-3 text-slate-300 font-sans">{issuer.sector}</td>
                  <td className="p-3 text-slate-400">{issuer.country}</td>
                  <td className="p-3 text-slate-300 font-bold">{issuer.rating}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded font-bold text-xs ${
                      issuer.opportunityScore >= 90 ? "bg-rose-950 text-rose-400 border border-rose-800/20" :
                      issuer.opportunityScore >= 80 ? "bg-amber-950 text-amber-400 border border-amber-800/20" :
                      "bg-slate-900 text-slate-400 border border-slate-850"
                    }`}>
                      {issuer.opportunityScore}%
                    </span>
                  </td>
                  <td className="p-3 text-right text-sky-400 font-semibold font-mono">
                    {selectedCurrency === "EUR" ? "EUR" : 
                     selectedCurrency === "GBP" ? "GBP" : 
                     selectedCurrency === "USD" ? "USD" : "CHF"} {issuer.fundingNeed}M
                  </td>
                  <td className="p-3 text-center text-slate-300">{issuer.marketFeasibility}%</td>
                  <td className="p-3 text-center text-emerald-400">{issuer.dataConfidence}%</td>
                  <td className="p-3 text-slate-300 font-sans">{issuer.suggestedProduct}</td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button 
                        onClick={() => onAssignBanker(issuer.id)}
                        title="Assign Coverage Banker"
                        className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition cursor-pointer"
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={() => onGenerateBrief(issuer.id)}
                        title="Generate AI Meeting Brief"
                        className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-sky-400 rounded transition cursor-pointer"
                      >
                        <FileEdit className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={() => onSelectIssuer(issuer.id)}
                        title="Open Issuer Profile"
                        className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition cursor-pointer"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE DEAL MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 w-full max-w-md rounded overflow-hidden shadow-2xl">
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
              <span className="text-xs font-mono font-bold tracking-wider text-white uppercase">Create New Origination Opportunity</span>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white font-bold font-mono text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCreateOpp} className="p-4 space-y-4 font-mono">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase text-slate-400 font-bold block">Issuer Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. ASML Holding NV"
                  value={newOppName}
                  onChange={(e) => setNewOppName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 placeholder-slate-600 outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase text-slate-400 font-bold block">Sector Segment</label>
                <select 
                  value={newOppSector}
                  onChange={(e) => setNewOppSector(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 outline-none"
                >
                  <option value="Aerospace & Defense">Aerospace & Defense</option>
                  <option value="Industrial Conglomerate">Industrial Conglomerate</option>
                  <option value="Luxury Goods">Luxury Goods</option>
                  <option value="Energy / Oil & Gas">Energy / Oil & Gas</option>
                  <option value="Technology / Semiconductors">Technology / Semiconductors</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase text-slate-400 font-bold block">Opportunity Score (0-100)</label>
                  <input 
                    type="number" 
                    min={40}
                    max={100}
                    value={newOppScore}
                    onChange={(e) => setNewOppScore(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 outline-none"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase text-slate-400 font-bold block">Priority Allocation</label>
                  <select 
                    value={newOppPriority}
                    onChange={(e) => setNewOppPriority(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 outline-none"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-900">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs transition cursor-pointer"
                >
                  Save Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

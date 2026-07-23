/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { 
  Building2, 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  ExternalLink, 
  CheckCircle, 
  PlusCircle, 
  Bookmark, 
  BookmarkCheck,
  TrendingUp,
  UserCheck,
  Percent,
  BarChart2,
  ListFilter
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { Issuer } from "../types";

interface ClientDirectoryProps {
  issuers: Issuer[];
  onSelectIssuer: (id: string) => void;
  watchlistIds: string[];
  onToggleWatchlist: (id: string) => void;
}

export default function ClientDirectory({ 
  issuers, 
  onSelectIssuer, 
  watchlistIds, 
  onToggleWatchlist 
}: ClientDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedRating, setSelectedRating] = useState("All");

  // Get unique lists for filtering dropdowns
  const sectors = useMemo(() => {
    return ["All", ...Array.from(new Set(issuers.map(i => i.sector)))];
  }, [issuers]);

  const countries = useMemo(() => {
    return ["All", ...Array.from(new Set(issuers.map(i => i.country)))];
  }, [issuers]);

  const ratings = useMemo(() => {
    return ["All", ...Array.from(new Set(issuers.map(i => i.rating)))];
  }, [issuers]);

  // Filtered Issuers List
  const filteredClients = useMemo(() => {
    return issuers.filter(client => {
      const matchesSearch = 
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.assignedBanker.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSector = selectedSector === "All" || client.sector === selectedSector;
      const matchesCountry = selectedCountry === "All" || client.country === selectedCountry;
      const matchesRating = selectedRating === "All" || client.rating === selectedRating;

      return matchesSearch && matchesSector && matchesCountry && matchesRating;
    });
  }, [issuers, searchQuery, selectedSector, selectedCountry, selectedRating]);

  // Chart: Client Counts by Sector
  const sectorCountsData = useMemo(() => {
    const counts: { [key: string]: number } = {};
    filteredClients.forEach(c => {
      counts[c.sector] = (counts[c.sector] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [filteredClients]);

  // Chart: Average Opportunity Score by Sector
  const sectorScoresData = useMemo(() => {
    const data: { [key: string]: { total: number; count: number } } = {};
    filteredClients.forEach(c => {
      if (!data[c.sector]) {
        data[c.sector] = { total: 0, count: 0 };
      }
      data[c.sector].total += c.opportunityScore;
      data[c.sector].count += 1;
    });
    return Object.entries(data).map(([name, val]) => ({
      name,
      avgScore: Math.round(val.total / val.count)
    }));
  }, [filteredClients]);

  const COLORS = ["#0284c7", "#10b981", "#f59e0b", "#6366f1", "#ec4899", "#14b8a6", "#8b5cf6"];

  return (
    <div className="space-y-6" id="client-directory-root">
      {/* Title & Stats Banner */}
      <div className="border border-slate-800 bg-slate-950 p-5 rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4" id="directory-header">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-sky-400" />
            <h2 className="text-base font-bold text-white tracking-tight uppercase">Corporate Client Registry</h2>
          </div>
          <p className="text-xs text-slate-400 font-sans leading-relaxed max-w-xl">
            Real-time coverage and capital markets profiling for European corporate relationships, credit parameters, and predictive investment banking opportunity flags.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs font-mono border-l border-slate-800 pl-6" id="directory-agg-metrics">
          <div>
            <div className="text-slate-500 uppercase text-[9px] font-bold">Total Clients</div>
            <div className="text-lg font-bold text-white mt-0.5">{issuers.length}</div>
          </div>
          <div>
            <div className="text-slate-500 uppercase text-[9px] font-bold">Filtered Count</div>
            <div className="text-lg font-bold text-sky-400 mt-0.5">{filteredClients.length}</div>
          </div>
          <div>
            <div className="text-slate-500 uppercase text-[9px] font-bold">Avg Opportunity</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">
              {filteredClients.length > 0 
                ? `${Math.round(filteredClients.reduce((acc, c) => acc + c.opportunityScore, 0) / filteredClients.length)}%`
                : "N/A"}
            </div>
          </div>
        </div>
      </div>

      {/* Directory Visualizations */}
      {filteredClients.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="directory-charts">
          {/* Sector distribution bar chart */}
          <div className="border border-slate-800 bg-slate-950 p-4 rounded flex flex-col h-[240px]">
            <span className="text-xs text-slate-400 font-semibold uppercase mb-3 flex items-center gap-1.5">
              <BarChart2 className="h-3.5 w-3.5 text-sky-400" /> Clients Count by Sector
            </span>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectorCountsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={9} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155" }} />
                  <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                    {sectorCountsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Average Opportunity Score by sector */}
          <div className="border border-slate-800 bg-slate-950 p-4 rounded flex flex-col h-[240px]">
            <span className="text-xs text-slate-400 font-semibold uppercase mb-3 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" /> Avg Opportunity Score by Sector (%)
            </span>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectorScoresData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={9} tickLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155" }} />
                  <Bar dataKey="avgScore" fill="#0284c7" radius={[2, 2, 0, 0]} name="Avg Score (%)">
                    {sectorScoresData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Directory Filter Panel */}
      <div className="border border-slate-800 bg-slate-950 p-4 rounded space-y-4" id="directory-filter-bar">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search by client name, ticker, banker..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-sky-500 font-sans"
            />
          </div>

          {/* Select dropdowns */}
          <div className="grid grid-cols-3 gap-2 md:w-[450px]">
            <div className="space-y-1">
              <span className="text-[9px] uppercase text-slate-500 font-bold block">Sector</span>
              <select 
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none cursor-pointer font-sans"
              >
                {sectors.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] uppercase text-slate-500 font-bold block">Country</span>
              <select 
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none cursor-pointer font-sans"
              >
                {countries.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] uppercase text-slate-500 font-bold block">Rating</span>
              <select 
                value={selectedRating}
                onChange={(e) => setSelectedRating}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none cursor-pointer font-sans"
              >
                {ratings.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid List */}
      <div className="border border-slate-800 bg-slate-950 rounded overflow-hidden" id="directory-grid-container">
        {filteredClients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" id="directory-table">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/40 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Client Name</th>
                  <th className="py-3 px-4">Geography / Sector</th>
                  <th className="py-3 px-4">Credit Rating</th>
                  <th className="py-3 px-4">Opportunity Score</th>
                  <th className="py-3 px-4">Funding capacity</th>
                  <th className="py-3 px-4">Assigned Banker</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-xs font-sans">
                {filteredClients.map((client) => {
                  const isWatchlisted = watchlistIds.includes(client.id);
                  let ratingBadgeColor = "text-sky-400 bg-sky-950/40 border-sky-800/20";
                  if (client.rating.includes("A")) ratingBadgeColor = "text-emerald-400 bg-emerald-950/40 border-emerald-850/20";
                  else if (client.rating.includes("B")) ratingBadgeColor = "text-amber-400 bg-amber-950/40 border-amber-850/20";

                  let scoreColor = "text-sky-400";
                  if (client.opportunityScore >= 85) scoreColor = "text-emerald-400";
                  else if (client.opportunityScore < 70) scoreColor = "text-slate-400";

                  return (
                    <tr 
                      key={client.id} 
                      className="hover:bg-slate-900/40 transition group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-white group-hover:text-sky-400 transition cursor-pointer" onClick={() => onSelectIssuer(client.id)}>
                            {client.name}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono mt-0.5">{client.ticker}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        <div className="flex flex-col">
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-slate-500" /> {client.country}</span>
                          <span className="text-slate-500 text-[10px] mt-0.5">{client.sector}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono">
                        <span className={`px-2 py-0.5 border rounded text-[10px] font-semibold ${ratingBadgeColor}`}>
                          {client.rating}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${scoreColor}`}>{client.opportunityScore}%</span>
                          <div className="w-16 h-1 bg-slate-900 rounded overflow-hidden hidden sm:block">
                            <div className="h-full bg-sky-500 rounded" style={{ width: `${client.opportunityScore}%` }}></div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300 font-mono">
                        EUR {client.fundingNeed}M
                      </td>

                      <td className="py-3.5 px-4 text-slate-400 font-sans">
                        {client.assignedBanker || "Unassigned"}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => onToggleWatchlist(client.id)}
                            className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition cursor-pointer"
                            title={isWatchlisted ? "Remove from Watchlist" : "Add to Watchlist"}
                          >
                            {isWatchlisted ? (
                              <BookmarkCheck className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <Bookmark className="h-4 w-4" />
                            )}
                          </button>
                          
                          <button 
                            onClick={() => onSelectIssuer(client.id)}
                            className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 hover:border-slate-700 rounded text-[10px] font-mono transition flex items-center gap-1 cursor-pointer"
                          >
                            Profile <ExternalLink className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center" id="directory-empty-state">
            <div className="text-slate-500 mb-1 font-semibold">No clients match your filter criteria</div>
            <p className="text-xs text-slate-600 font-sans">Try broadening your search query or choosing different sector/country filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

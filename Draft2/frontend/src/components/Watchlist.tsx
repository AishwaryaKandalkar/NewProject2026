/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Pin, 
  Trash2, 
  Mail, 
  Clock, 
  ExternalLink,
  Info,
  Notebook
} from "lucide-react";
import { Issuer } from "../types";

interface WatchlistProps {
  issuers: Issuer[];
  watchlistIds: string[];
  onRemoveFromWatchlist: (id: string) => void;
  onSelectIssuer: (id: string) => void;
}

export default function Watchlist({ 
  issuers, 
  watchlistIds, 
  onRemoveFromWatchlist, 
  onSelectIssuer 
}: WatchlistProps) {
  // Local notes store for watchlisted companies
  const [notes, setNotes] = useState<{ [id: string]: string }>({
    airbus: "Discussed green covenant scaling with treasury team last Tuesday. Receptive.",
    siemens: "Jan 2027 refinancing represents solid sole-lead advisor target."
  });
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  const watchlistedIssuers = issuers.filter(i => watchlistIds.includes(i.id));

  const handleEditNote = (id: string) => {
    setEditingNoteId(id);
    setNoteText(notes[id] || "");
  };

  const handleSaveNote = (id: string) => {
    setNotes(prev => ({ ...prev, [id]: noteText }));
    setEditingNoteId(null);
  };

  return (
    <div className="space-y-6" id="watchlist-root">
      {/* Title Header */}
      <div className="border border-slate-800 bg-slate-950 p-4 rounded flex justify-between items-center" id="watchlist-header">
        <div>
          <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Pin className="h-4 w-4 text-sky-400 rotate-45" /> Monitored Corporate Watchlist
          </h2>
          <p className="text-xs text-slate-400 font-sans">Track high-yield or investment-grade corporates tagged for immediate capital raises or strategic advisory.</p>
        </div>
        <div className="text-xs font-mono text-slate-400">
          MONITORED: <span className="text-sky-400 font-bold">{watchlistedIssuers.length} Issuers</span>
        </div>
      </div>

      {watchlistedIssuers.length === 0 ? (
        <div className="border border-slate-900 bg-slate-950/40 p-8 rounded text-center" id="watchlist-empty">
          <Pin className="h-8 w-8 text-slate-700 mx-auto mb-3 rotate-45" />
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase">Your Watchlist is Empty</h3>
          <p className="text-xs text-slate-500 font-sans mt-1 max-w-sm mx-auto">
            Navigate to the Opportunity Radar or Issuer Explorer and select "Add to Watchlist" to anchor clients here for close daily monitoring.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4" id="watchlist-grid">
          {watchlistedIssuers.map(issuer => (
            <div key={issuer.id} className="border border-slate-800 bg-slate-950 p-4 rounded space-y-3.5 hover:border-slate-700 transition">
              {/* Header profile info */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-900 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 
                      onClick={() => onSelectIssuer(issuer.id)}
                      className="text-sm font-mono font-bold text-white hover:text-sky-400 transition cursor-pointer"
                    >
                      {issuer.name}
                    </h3>
                    <span className="text-xs font-mono text-slate-500">({issuer.ticker})</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono tracking-wider font-semibold uppercase ${
                      issuer.priority === "CRITICAL" ? "bg-rose-950 text-rose-400 border border-rose-800/20" : "bg-amber-950 text-amber-400 border border-amber-800/20"
                    }`}>
                      {issuer.priority}
                    </span>
                  </div>
                  <div className="text-[11px] font-sans text-slate-400">{issuer.sector} • {issuer.country}</div>
                </div>

                <div className="flex items-center gap-6 font-mono text-xs">
                  <div>
                    <span className="text-[9px] uppercase text-slate-500 block">Predictive Score</span>
                    <span className="font-bold text-sky-400">{issuer.opportunityScore}%</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-slate-500 block">Funding Need</span>
                    <span className="font-bold text-white">EUR {issuer.fundingNeed}M</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-slate-500 block">Lead Banker</span>
                    <span className="font-semibold text-slate-300 font-sans">{issuer.assignedBanker.split(" (")[0]}</span>
                  </div>
                  
                  <div className="flex gap-1.5 ml-2">
                    <button 
                      onClick={() => onSelectIssuer(issuer.id)}
                      title="Open Profile"
                      className="p-1.5 hover:bg-slate-900 text-slate-400 hover:text-white rounded border border-slate-900 cursor-pointer"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                    <button 
                      onClick={() => onRemoveFromWatchlist(issuer.id)}
                      title="Remove Monitor"
                      className="p-1.5 hover:bg-slate-900 text-rose-500 hover:bg-rose-950 rounded border border-slate-900 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Collateral notes and strategic actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                {/* Strategic note */}
                <div className="md:col-span-2 space-y-1.5 bg-slate-900/40 p-3 rounded border border-slate-900">
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400">
                    <span className="flex items-center gap-1"><Notebook className="h-3 w-3 text-sky-400" /> Coverage Notes</span>
                    {editingNoteId === issuer.id ? (
                      <button onClick={() => handleSaveNote(issuer.id)} className="text-emerald-400 hover:underline cursor-pointer">SAVE</button>
                    ) : (
                      <button onClick={() => handleEditNote(issuer.id)} className="text-sky-400 hover:underline cursor-pointer">EDIT</button>
                    )}
                  </div>
                  {editingNoteId === issuer.id ? (
                    <textarea 
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      rows={2}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-200 outline-none"
                    />
                  ) : (
                    <p className="text-slate-300 font-sans leading-relaxed text-xs">
                      {notes[issuer.id] || "No collaborative notes saved. Record meeting details or capital structural mandates decisions here."}
                    </p>
                  )}
                </div>

                {/* Direct Action triggers */}
                <div className="space-y-2 flex flex-col justify-center">
                  <div className="text-[9px] uppercase text-slate-500 font-bold block">Advisory Outreach Triggers</div>
                  <button 
                    onClick={() => {
                      const subject = encodeURIComponent(`SIG Advisory: Structured Opportunity Alert - ${issuer.name}`);
                      const body = encodeURIComponent(`Dear Team,\n\nSIG AI origination telemetry points to an immediate structural opportunity in ${issuer.suggestedProduct} for ${issuer.name}.\n\nNext Action: ${issuer.nextAction}.\n\nBest,\nAdvisory Desk`);
                      window.location.href = `mailto:?subject=${subject}&body=${body}`;
                    }}
                    className="w-full py-1.5 bg-slate-900 hover:bg-slate-850 rounded text-left px-2.5 text-slate-300 flex items-center gap-2 transition cursor-pointer"
                  >
                    <Mail className="h-3.5 w-3.5 text-emerald-400" /> Email Advisory Team
                  </button>
                  <div className="text-[9px] text-slate-500 flex items-center gap-1 px-1">
                    <Clock className="h-3 w-3" /> Last updated: {new Date(issuer.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

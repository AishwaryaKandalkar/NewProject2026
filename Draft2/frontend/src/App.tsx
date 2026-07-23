/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Network, 
  Home, 
  Sliders, 
  Search, 
  Bell, 
  CheckSquare, 
  Activity, 
  FileText, 
  Settings, 
  Pin,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Send,
  User,
  Database,
  RefreshCw,
  Clock,
  HelpCircle,
  Building2
} from "lucide-react";

// Views
import HomeView from "./components/HomeView";
import ClientDirectory from "./components/ClientDirectory";
import OpportunityRadar from "./components/OpportunityRadar";
import IssuerExplorer from "./components/IssuerExplorer";
import DataAndSignals from "./components/DataAndSignals";
import GraphView from "./components/GraphView";
import Watchlist from "./components/Watchlist";
import Alerts from "./components/Alerts";
import MyActions from "./components/MyActions";
import MarketMonitor from "./components/MarketMonitor";
import Reports from "./components/Reports";
import Admin from "./components/Admin";

import { Issuer, MarketIndicator, Alert, MyAction } from "./types";

export default function App() {
  // Global Platform State
  const [issuers, setIssuers] = useState<Issuer[]>([]);
  const [marketIndicators, setMarketIndicators] = useState<MarketIndicator[]>([]);
  const [marketSummary, setMarketSummary] = useState("");
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [actions, setActions] = useState<MyAction[]>([]);
  const [watchlistIds, setWatchlistIds] = useState<string[]>(["airbus", "siemens"]);
  
  const [selectedIssuerId, setSelectedIssuerId] = useState<string>("airbus");
  const [activeTab, setActiveTab] = useState<string>("home");
  const [loading, setLoading] = useState(true);

  // Copilot Chat States
  const [showCopilot, setShowCopilot] = useState(true);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "copilot"; content: string }>>([
    { role: "copilot", content: "Welcome to SIG Strategic Advisory Desk. I have synthesized current European corporate cash, credit positions, and rating logs. Ask me to draft client briefing memoranda, evaluate convertible trends, or find high-urgency refinancing targets." }
  ]);
  const [aiGenerating, setAiGenerating] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Fetch initial corporate registries from backend API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/data");
      const data = await res.json();
      setIssuers(data.issuers);
      setMarketIndicators(data.marketIndicators);
      setMarketSummary(data.marketSummary);
      setAlerts(data.alerts);
      setActions(data.actions);
      
      // Auto-select first issuer if available
      if (data.issuers.length > 0) {
        setSelectedIssuerId(data.issuers[0].id);
      }
    } catch (e) {
      console.error("API Fetch Error:", e);
    } finally {
      setLoading(false);
    }
  };

  // Scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, aiGenerating]);

  // View handlers
  const handleSelectIssuer = (id: string) => {
    setSelectedIssuerId(id);
    setActiveTab("explorer");
  };

  const handleToggleWatchlist = (id: string) => {
    setWatchlistIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleRemoveFromWatchlist = (id: string) => {
    setWatchlistIds(prev => prev.filter(item => item !== id));
  };

  const handleUpdateActionStatus = async (id: string, status: "PENDING" | "IN_PROGRESS" | "COMPLETED") => {
    try {
      const res = await fetch("/api/actions/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      const data = await res.json();
      if (data.success) {
        setActions(prev => prev.map(item => item.id === id ? { ...item, status } : item));
      }
    } catch (err) {
      console.error("Error updating action:", err);
    }
  };

  const handleClearAlert = (id: string) => {
    setAlerts(prev => prev.filter(item => item.id !== id));
  };

  const handleCreateOpportunity = async (newOpp: Partial<Issuer>) => {
    try {
      const res = await fetch("/api/issuers/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOpp)
      });
      const data = await res.json();
      if (data.success) {
        // Refetch full datasets to get synced alerts and issuers list
        fetchData();
        setActiveTab("radar");
      }
    } catch (err) {
      console.error("Error creating opportunity:", err);
    }
  };

  const handleAssignBanker = (issuerId: string) => {
    const issuerName = issuers.find(i => i.id === issuerId)?.name || "Issuer";
    // Prompt mock assign banker
    const name = prompt(`Enter coverage banker name to assign to ${issuerName}:`, "Jean-Pierre Laurent (Managing Director)");
    if (name) {
      setIssuers(prev => prev.map(item => {
        if (item.id === issuerId) {
          return { ...item, assignedBanker: name };
        }
        return item;
      }));
      alert(`Banker assignment updated for ${issuerName}.`);
    }
  };

  // Generate AI Pitch brief directly from any view using Gemini copilot
  const handleGenerateBrief = async (issuerId: string) => {
    const issuer = issuers.find(i => i.id === issuerId);
    if (!issuer) return;

    setActiveTab("explorer");
    setShowCopilot(true);
    
    const promptMessage = `Draft an executive investment banking meeting briefing dossier for ${issuer.name} (${issuer.ticker}). Focus on their ${issuer.suggestedProduct} and recommended next steps.`;
    handleSendCopilotMessage(promptMessage);
  };

  // Submit message to server-side Gemini Copilot
  const handleSendCopilotMessage = async (msgText: string) => {
    if (!msgText.trim()) return;

    const userMsg = msgText;
    setChatMessage("");
    
    // Add user message to history
    setChatHistory(prev => [...prev, { role: "user", content: userMsg }]);
    setAiGenerating(true);

    try {
      // Map history to server format
      const mappedHistory = chatHistory.map(turn => ({
        role: turn.role,
        content: turn.content
      }));

      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          chatHistory: mappedHistory
        })
      });
      
      const data = await res.json();
      if (data.text) {
        setChatHistory(prev => [...prev, { role: "copilot", content: data.text }]);
      } else {
        setChatHistory(prev => [...prev, { role: "copilot", content: "Error: No advisory output produced by Gemini." }]);
      }
    } catch (err: any) {
      console.error("Copilot Chat Error:", err);
      setChatHistory(prev => [...prev, { role: "copilot", content: `Error: Server failed to process advisory request. (${err.message})` }]);
    } finally {
      setAiGenerating(false);
    }
  };

  const selectedIssuer = issuers.find(i => i.id === selectedIssuerId) || issuers[0];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans antialiased selection:bg-sky-500 selection:text-white" id="sig-framework-root">
      {/* 1. LEFT SIDEBAR: Persistent high-density navigation */}
      <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col justify-between" id="platform-left-sidebar">
        <div>
          {/* Logo Brand Header */}
          <div className="p-4.5 border-b border-slate-900 bg-slate-950/40 flex items-center gap-2.5" id="brand-logo-area">
            <div className="w-8 h-8 rounded bg-sky-600 flex items-center justify-center text-white font-bold text-lg select-none">
              Σ
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-wider">SIG</div>
              <div className="text-[9px] text-sky-400 font-semibold tracking-tight uppercase">Strategic Origination</div>
            </div>
          </div>

          {/* Navigation Menu Links */}
          <nav className="p-3.5 space-y-1" id="navigation-roster">
            <span className="text-[9px] uppercase text-slate-500 font-bold px-2.5 block mb-2">Deal Desks Overview</span>
            
            <button 
              onClick={() => setActiveTab("home")}
              className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-medium flex items-center justify-between transition cursor-pointer ${
                activeTab === "home" ? "bg-slate-900 text-sky-400 font-bold border-l-2 border-sky-500" : "text-slate-400 hover:text-white hover:bg-slate-900/40"
              }`}
            >
              <span className="flex items-center gap-2"><Home className="h-3.5 w-3.5" /> Executive Dashboard</span>
            </button>

            <button 
              onClick={() => setActiveTab("directory")}
              className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-medium flex items-center justify-between transition cursor-pointer ${
                activeTab === "directory" ? "bg-slate-900 text-sky-400 font-bold border-l-2 border-sky-500" : "text-slate-400 hover:text-white hover:bg-slate-900/40"
              }`}
            >
              <span className="flex items-center gap-2"><Building2 className="h-3.5 w-3.5" /> Client Directory</span>
              <span className="px-1.5 py-0.2 bg-slate-900 text-slate-400 text-[8px] rounded">{issuers.length}</span>
            </button>

            <button 
              onClick={() => setActiveTab("radar")}
              className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-medium flex items-center justify-between transition cursor-pointer ${
                activeTab === "radar" ? "bg-slate-900 text-sky-400 font-bold border-l-2 border-sky-500" : "text-slate-400 hover:text-white hover:bg-slate-900/40"
              }`}
            >
              <span className="flex items-center gap-2"><Sliders className="h-3.5 w-3.5" /> Opportunity Radar</span>
              <span className="px-1.5 py-0.2 bg-rose-950 text-rose-400 text-[8px] font-bold rounded">HOT</span>
            </button>

            <button 
              onClick={() => setActiveTab("explorer")}
              className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-medium flex items-center justify-between transition cursor-pointer ${
                activeTab === "explorer" ? "bg-slate-900 text-sky-400 font-bold border-l-2 border-sky-500" : "text-slate-400 hover:text-white hover:bg-slate-900/40"
              }`}
            >
              <span className="flex items-center gap-2"><Search className="h-3.5 w-3.5" /> Issuer Explorer</span>
            </button>

            <button 
              onClick={() => setActiveTab("signals")}
              className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-medium flex items-center justify-between transition cursor-pointer ${
                activeTab === "signals" ? "bg-slate-900 text-sky-400 font-bold border-l-2 border-sky-500" : "text-slate-400 hover:text-white hover:bg-slate-900/40"
              }`}
            >
              <span className="flex items-center gap-2"><Database className="h-3.5 w-3.5" /> Signals & Data</span>
            </button>

            <button 
              onClick={() => setActiveTab("graph")}
              className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-mono font-medium flex items-center justify-between transition cursor-pointer ${
                activeTab === "graph" ? "bg-slate-900 text-sky-400 font-bold border-l-2 border-sky-500" : "text-slate-400 hover:text-white hover:bg-slate-900/40"
              }`}
            >
              <span className="flex items-center gap-2"><Network className="h-3.5 w-3.5" /> Relationship Graph</span>
            </button>

            <span className="text-[9px] uppercase text-slate-500 font-bold px-2.5 block pt-4 mb-2">My Workspaces</span>

            <button 
              onClick={() => setActiveTab("watchlist")}
              className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-mono font-medium flex items-center justify-between transition cursor-pointer ${
                activeTab === "watchlist" ? "bg-slate-900 text-sky-400 font-bold border-l-2 border-sky-500" : "text-slate-400 hover:text-white hover:bg-slate-900/40"
              }`}
            >
              <span className="flex items-center gap-2"><Pin className="h-3.5 w-3.5 rotate-45" /> My Watchlist</span>
              <span className="px-1.5 py-0.2 bg-slate-900 text-slate-400 text-[8px] rounded">{watchlistIds.length}</span>
            </button>

            <button 
              onClick={() => setActiveTab("alerts")}
              className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-mono font-medium flex items-center justify-between transition cursor-pointer ${
                activeTab === "alerts" ? "bg-slate-900 text-sky-400 font-bold border-l-2 border-sky-500" : "text-slate-400 hover:text-white hover:bg-slate-900/40"
              }`}
            >
              <span className="flex items-center gap-2"><Bell className="h-3.5 w-3.5" /> Signal Alerts</span>
              <span className="px-1.5 py-0.2 bg-rose-950 text-rose-400 text-[8px] font-bold rounded">{alerts.length}</span>
            </button>

            <button 
              onClick={() => setActiveTab("tasks")}
              className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-mono font-medium flex items-center justify-between transition cursor-pointer ${
                activeTab === "tasks" ? "bg-slate-900 text-sky-400 font-bold border-l-2 border-sky-500" : "text-slate-400 hover:text-white hover:bg-slate-900/40"
              }`}
            >
              <span className="flex items-center gap-2"><CheckSquare className="h-3.5 w-3.5" /> Action Queue</span>
              <span className="px-1.5 py-0.2 bg-slate-900 text-slate-400 text-[8px] rounded">
                {actions.filter(a => a.status !== "COMPLETED").length}
              </span>
            </button>

            <button 
              onClick={() => setActiveTab("markets")}
              className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-mono font-medium flex items-center justify-between transition cursor-pointer ${
                activeTab === "markets" ? "bg-slate-900 text-sky-400 font-bold border-l-2 border-sky-500" : "text-slate-400 hover:text-white hover:bg-slate-900/40"
              }`}
            >
              <span className="flex items-center gap-2"><Activity className="h-3.5 w-3.5" /> Market Monitor</span>
            </button>

            <button 
              onClick={() => setActiveTab("reports")}
              className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-mono font-medium flex items-center justify-between transition cursor-pointer ${
                activeTab === "reports" ? "bg-slate-900 text-sky-400 font-bold border-l-2 border-sky-500" : "text-slate-400 hover:text-white hover:bg-slate-900/40"
              }`}
            >
              <span className="flex items-center gap-2"><FileText className="h-3.5 w-3.5" /> Document Exports</span>
            </button>

            <button 
              onClick={() => setActiveTab("admin")}
              className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-mono font-medium flex items-center justify-between transition cursor-pointer ${
                activeTab === "admin" ? "bg-slate-900 text-sky-400 font-bold border-l-2 border-sky-500" : "text-slate-400 hover:text-white hover:bg-slate-900/40"
              }`}
            >
              <span className="flex items-center gap-2"><Settings className="h-3.5 w-3.5" /> Settings</span>
            </button>
          </nav>
        </div>

        {/* User Identity Margin Block */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/60 font-sans" id="user-profile-identity">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-sky-900 flex items-center justify-center font-bold text-white text-xs select-none uppercase">
              AK
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-slate-200 truncate">aishkandalkar@gmail.com</div>
              <div className="text-[10px] text-slate-500 font-mono">Investment Banking Analyst</div>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. CENTER PANEL: Main workspace container */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-950 overflow-hidden" id="workspace-center">
        {/* Top Header Controls Bar */}
        <header className="h-14 border-b border-slate-900 bg-slate-950 px-5 flex items-center justify-between" id="header-control-bar">
          <div className="flex items-center gap-4 text-xs">
            <span className="font-bold text-white uppercase tracking-wider text-[11px] font-sans flex items-center gap-2">
              SIG Strategic Advisory Desk
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400 font-sans">Global Corporate Origination & Capital Underwriting Platform</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Direct Quick Launch Copilot */}
            <button 
              onClick={() => setShowCopilot(prev => !prev)}
              className="px-3 py-1.5 bg-sky-950 hover:bg-sky-900 text-sky-400 font-sans font-medium rounded text-xs border border-sky-800/40 flex items-center gap-2 transition cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" /> AI COPILOT DESK
            </button>
          </div>
        </header>

        {/* Content Viewer viewport */}
        <div className="flex-1 overflow-y-auto p-5" id="workspace-viewport">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 font-mono space-y-3" id="viewport-loading">
              <RefreshCw className="h-8 w-8 animate-spin text-sky-500" />
              <p className="text-xs">Assembling European corporate debt underwriting registers...</p>
            </div>
          ) : (
            <>
              {activeTab === "home" && (
                <HomeView 
                  issuers={issuers} 
                  alerts={alerts}
                  actions={actions}
                  onSelectIssuer={handleSelectIssuer} 
                  onNavigate={(view) => {
                    if (view === "Opportunity Radar") setActiveTab("radar");
                    else if (view === "Graph View") setActiveTab("graph");
                    else if (view === "Alerts") setActiveTab("alerts");
                    else if (view === "My Actions") setActiveTab("tasks");
                  }}
                />
              )}
              {activeTab === "directory" && (
                <ClientDirectory 
                  issuers={issuers} 
                  onSelectIssuer={handleSelectIssuer} 
                  watchlistIds={watchlistIds}
                  onToggleWatchlist={handleToggleWatchlist}
                />
              )}
              {activeTab === "radar" && (
                <OpportunityRadar 
                  issuers={issuers} 
                  onSelectIssuer={handleSelectIssuer}
                  onAssignBanker={handleAssignBanker}
                  onGenerateBrief={handleGenerateBrief}
                  onCreateOpportunity={handleCreateOpportunity}
                />
              )}
              {activeTab === "explorer" && (
                <IssuerExplorer 
                  issuer={selectedIssuer}
                  onToggleWatchlist={handleToggleWatchlist}
                  isWatchlisted={watchlistIds.includes(selectedIssuerId)}
                  onGenerateBrief={handleGenerateBrief}
                />
              )}
              {activeTab === "signals" && (
                <DataAndSignals 
                  issuers={issuers}
                  onSelectIssuer={handleSelectIssuer}
                />
              )}
              {activeTab === "graph" && (
                <GraphView />
              )}
              {activeTab === "watchlist" && (
                <Watchlist 
                  issuers={issuers}
                  watchlistIds={watchlistIds}
                  onRemoveFromWatchlist={handleRemoveFromWatchlist}
                  onSelectIssuer={handleSelectIssuer}
                />
              )}
              {activeTab === "alerts" && (
                <Alerts 
                  alerts={alerts}
                  onSelectIssuer={handleSelectIssuer}
                  onClearAlert={handleClearAlert}
                />
              )}
              {activeTab === "tasks" && (
                <MyActions 
                  actions={actions}
                  onUpdateStatus={handleUpdateActionStatus}
                  onSelectIssuer={handleSelectIssuer}
                />
              )}
              {activeTab === "markets" && (
                <MarketMonitor 
                  indicators={marketIndicators}
                  summary={marketSummary}
                />
              )}
              {activeTab === "reports" && (
                <Reports />
              )}
              {activeTab === "admin" && (
                <Admin />
              )}
            </>
          )}
        </div>
      </main>

      {/* 3. RIGHT COLLAPSIBLE SIDEBAR: AI Copilot Advisory Panel */}
      {showCopilot && (
        <aside className="w-80 border-l border-slate-800 bg-slate-950 flex flex-col justify-between" id="copilot-advisory-sidebar">
          {/* Header Title block */}
          <div className="p-3.5 border-b border-slate-900 bg-slate-900/40 flex justify-between items-center" id="copilot-header">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-sky-400 animate-pulse" /> Strategic AI Copilot
            </span>
            <button 
              onClick={() => setShowCopilot(false)}
              className="text-slate-500 hover:text-white font-bold"
              title="Collapse Copilot"
            >
              ✕
            </button>
          </div>

          {/* Quick Click Prompt shortcuts */}
          <div className="bg-slate-950 p-2.5 border-b border-slate-900 text-[10px] space-y-1.5" id="shortcuts-panel">
            <span className="text-slate-500 uppercase font-bold block">Advisory Pitch Shortcuts</span>
            <div className="flex flex-col gap-1">
              <button 
                onClick={() => handleSendCopilotMessage(`Compare ASML and Kering SA refinancing opportunities. Highlight leverage and rating details.`)}
                className="py-1 px-2 bg-slate-900 hover:bg-slate-850 rounded text-left text-slate-300 font-mono truncate cursor-pointer"
              >
                ✦ Compare Refinancing Candidates
              </button>
              <button 
                onClick={() => handleSendCopilotMessage(`Draft an executive advisory memorandum for Siemens. Detail structured pricing at MS + 140bps.`)}
                className="py-1 px-2 bg-slate-900 hover:bg-slate-850 rounded text-left text-slate-300 font-mono truncate cursor-pointer"
              >
                ✦ Draft Siemens Memorandum
              </button>
              <button 
                onClick={() => handleSendCopilotMessage(`Are there any immediate Green Bond or convertible opportunities in high-yield space?`)}
                className="py-1 px-2 bg-slate-900 hover:bg-slate-850 rounded text-left text-slate-300 font-mono truncate cursor-pointer"
              >
                ✦ Find Green Bond targets
              </button>
            </div>
          </div>

          {/* Chat Messages Feed logs container */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3" id="chat-messages-container">
            {chatHistory.map((turn, index) => {
              const isUser = turn.role === "user";
              return (
                <div key={index} className={`space-y-1 ${isUser ? "text-right" : "text-left"}`}>
                  <span className="text-[8px] font-mono text-slate-500 uppercase font-bold block">
                    {isUser ? "aishkandalkar@gmail.com" : "SIG Advisory Desk"}
                  </span>
                  <div className={`p-2.5 rounded text-xs leading-relaxed font-sans inline-block max-w-[90%] text-left whitespace-pre-wrap ${
                    isUser ? "bg-sky-600 text-white font-semibold" : "bg-slate-900 text-slate-300 border border-slate-850"
                  }`}>
                    {turn.content}
                  </div>
                </div>
              );
            })}
            
            {aiGenerating && (
              <div className="space-y-1 text-left" id="ai-typing-loader">
                <span className="text-[8px] font-mono text-slate-500 uppercase font-bold block">SIG Desk</span>
                <div className="p-2.5 bg-slate-900 text-slate-400 border border-slate-850 rounded text-xs inline-block">
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-sky-500" /> Synthesizing capital structures and market spreads...
                  </span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Message input typing box */}
          <div className="p-3 border-t border-slate-900 bg-slate-950" id="chat-message-composer">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ask SIG Copilot..." 
                value={chatMessage}
                disabled={aiGenerating}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendCopilotMessage(chatMessage);
                  }
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded pl-3 pr-10 py-2.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-sky-500"
              />
              <button 
                onClick={() => handleSendCopilotMessage(chatMessage)}
                disabled={aiGenerating}
                className="absolute right-2 top-2 p-1 text-sky-500 hover:text-sky-400 disabled:opacity-50 cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}

// Simple loader icon placeholder
function Loader2({ className }: { className?: string }) {
  return <RefreshCw className={className} />;
}

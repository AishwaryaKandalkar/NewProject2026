/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { 
  PlusCircle, 
  Check, 
  Share2, 
  FileCheck, 
  AlertTriangle, 
  ShieldAlert, 
  Info,
  Layers, 
  Users, 
  Award, 
  Calendar,
  DollarSign,
  TrendingUp,
  X,
  Target
} from "lucide-react";
import { Issuer, GraphNode, GraphLink } from "../types";
import { GRAPH_NODES, GRAPH_LINKS } from "../data";

interface IssuerExplorerProps {
  issuer: Issuer;
  onToggleWatchlist: (id: string) => void;
  isWatchlisted: boolean;
  onGenerateBrief: (issuerId: string) => void;
}

export default function IssuerExplorer({ 
  issuer, 
  onToggleWatchlist, 
  isWatchlisted,
  onGenerateBrief
}: IssuerExplorerProps) {
  // Local active node in graph state
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  // Filter graph nodes and links relevant to this specific issuer
  const { nodes, links } = useMemo(() => {
    // Collect nodes that relate to the current issuer
    const currentIssuerNodeId = `node-${issuer.id}`;
    
    // Find links that are connected to this issuer node
    const connectedLinks = GRAPH_LINKS.filter(link => {
      const sourceId = typeof link.source === "string" ? link.source : (link.source as any).id;
      const targetId = typeof link.target === "string" ? link.target : (link.target as any).id;
      return sourceId === currentIssuerNodeId || targetId === currentIssuerNodeId;
    });

    // Collect list of connected node IDs
    const connectedNodeIds = new Set<string>([currentIssuerNodeId]);
    connectedLinks.forEach(link => {
      const sourceId = typeof link.source === "string" ? link.source : (link.source as any).id;
      const targetId = typeof link.target === "string" ? link.target : (link.target as any).id;
      connectedNodeIds.add(sourceId);
      connectedNodeIds.add(targetId);
    });

    // Also include generic relevant nodes like investors and ESG sector node
    const relevantNodes = GRAPH_NODES.filter(node => connectedNodeIds.has(node.id));
    
    return {
      nodes: relevantNodes,
      links: connectedLinks
    };
  }, [issuer]);

  // Click handler for nodes
  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
  };

  // Generate coordinate mappings dynamically for an elegant orbital layout
  const positionedNodes = useMemo(() => {
    const radius = 130;
    const center_x = 220;
    const center_y = 150;
    const issuerNodeId = `node-${issuer.id}`;

    return nodes.map((node, index) => {
      if (node.id === issuerNodeId) {
        return { ...node, x: center_x, y: center_y };
      }
      
      // Orbit other nodes around the issuer
      const angle = (2 * Math.PI * index) / (nodes.length - 1 || 1);
      return {
        ...node,
        x: center_x + radius * Math.cos(angle),
        y: center_y + radius * Math.sin(angle)
      };
    });
  }, [nodes, issuer]);

  // Map links to coordinates
  const linkLines = useMemo(() => {
    return links.map(link => {
      const sourceId = typeof link.source === "string" ? link.source : (link.source as any).id;
      const targetId = typeof link.target === "string" ? link.target : (link.target as any).id;
      
      const sourceNode = positionedNodes.find(n => n.id === sourceId);
      const targetNode = positionedNodes.find(n => n.id === targetId);
      
      if (sourceNode && targetNode) {
        return {
          id: `${sourceId}-${targetId}`,
          x1: sourceNode.x,
          y1: sourceNode.y,
          x2: targetNode.x,
          y2: targetNode.y,
          label: link.label
        };
      }
      return null;
    }).filter(Boolean);
  }, [links, positionedNodes]);

  return (
    <div className="space-y-6" id={`explorer-${issuer.id}`}>
      {/* Header Profile Section */}
      <div className="border border-slate-800 bg-slate-950 p-5 rounded" id="explorer-header">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-mono font-bold text-white tracking-tight">{issuer.name}</span>
              <span className="text-xs font-mono text-slate-500">[{issuer.ticker}]</span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono text-slate-400">
              <div>Country: <span className="text-slate-200">{issuer.country}</span></div>
              <div>Sector: <span className="text-slate-200">{issuer.sector}</span></div>
              <div>Rating: <span className="text-emerald-400 font-bold">{issuer.rating}</span></div>
              <div>Market Cap: <span className="text-slate-200">{issuer.marketCap}</span></div>
            </div>
          </div>
          
          <div className="flex gap-2" id="header-action-buttons">
            <button 
              onClick={() => onToggleWatchlist(issuer.id)}
              className={`px-3 py-1.5 text-xs font-mono rounded border transition flex items-center gap-1.5 cursor-pointer ${
                isWatchlisted 
                  ? "bg-emerald-950 text-emerald-400 border-emerald-800/40" 
                  : "bg-slate-900 text-slate-200 border-slate-800 hover:bg-slate-800"
              }`}
            >
              {isWatchlisted ? <Check className="h-3.5 w-3.5" /> : <PlusCircle className="h-3.5 w-3.5" />}
              {isWatchlisted ? "WATCHLISTED" : "ADD WATCHLIST"}
            </button>
            
            <button 
              onClick={() => onGenerateBrief(issuer.id)}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-mono font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <FileCheck className="h-3.5 w-3.5" /> GENERATE BRIEF
            </button>

            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Strategic profile link copied to clipboard.");
              }}
              className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 cursor-pointer"
              title="Share Profile"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Opportunity Overview KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-5 pt-5 border-t border-slate-900" id="overview-metrics-grid">
          <div className="border border-slate-900 bg-slate-950/40 p-3 rounded">
            <div className="text-[10px] font-mono uppercase text-slate-500">Opportunity Score</div>
            <div className="text-xl font-mono font-bold text-sky-400 mt-1">{issuer.opportunityScore}%</div>
            <div className="text-[9px] text-slate-400 mt-0.5 font-mono">Rank #1 sector-level</div>
          </div>
          
          <div className="border border-slate-900 bg-slate-950/40 p-3 rounded">
            <div className="text-[10px] font-mono uppercase text-slate-500">Target Funding Need</div>
            <div className="text-xl font-mono font-bold text-white mt-1">EUR {issuer.fundingNeed}M</div>
            <div className="text-[9px] text-slate-400 mt-0.5 font-mono">Structured capacity</div>
          </div>
          
          <div className="border border-slate-900 bg-slate-950/40 p-3 rounded">
            <div className="text-[10px] font-mono uppercase text-slate-500">Market Feasibility</div>
            <div className="text-xl font-mono font-bold text-white mt-1">{issuer.marketFeasibility}%</div>
            <div className="text-[9px] text-emerald-400 mt-0.5 font-mono">Highly Feasible</div>
          </div>
          
          <div className="border border-slate-900 bg-slate-950/40 p-3 rounded">
            <div className="text-[10px] font-mono uppercase text-slate-500">Data Confidence</div>
            <div className="text-xl font-mono font-bold text-white mt-1">{issuer.dataConfidence}%</div>
            <div className="text-[9px] text-slate-400 mt-0.5 font-mono">Verified credit feeds</div>
          </div>
          
          <div className="border border-slate-900 bg-slate-950/40 p-3 rounded col-span-2 md:col-span-1">
            <div className="text-[10px] font-mono uppercase text-slate-500">Relationship Readiness</div>
            <div className="text-xl font-mono font-bold text-emerald-400 mt-1">{issuer.relationshipReadiness}%</div>
            <div className="text-[9px] text-slate-400 mt-0.5 font-mono">Strong coverage</div>
          </div>
        </div>
      </div>

      {/* Main Analysis Panels (Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" id="explorer-analysis-panels">
        {/* Panel 1: Why Flagged */}
        <div className="border border-slate-800 bg-slate-950 p-4 rounded flex flex-col h-[400px]" id="panel-why-flagged">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 uppercase mb-3 border-b border-slate-900 pb-2">
            <TrendingUp className="h-4 w-4" /> Why Flagged (AI Drivers & Signals)
          </div>
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider">Primary AI Drivers</span>
              <ul className="space-y-1.5 list-disc list-inside text-slate-300 font-sans">
                {issuer.aiDrivers.map((item, index) => (
                  <li key={index} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider">Positive Signals</span>
              <ul className="space-y-1.5 list-disc list-inside text-slate-300 font-sans">
                {issuer.positiveSignals.map((item, index) => (
                  <li key={index} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider">Supporting Evidence</span>
              <ul className="space-y-1.5 list-disc list-inside text-slate-300 font-sans">
                {issuer.supportingEvidence.map((item, index) => (
                  <li key={index} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Panel 2: Counter Signals / Risks */}
        <div className="border border-slate-800 bg-slate-950 p-4 rounded flex flex-col h-[400px]" id="panel-risks">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-rose-400 uppercase mb-3 border-b border-slate-900 pb-2">
            <AlertTriangle className="h-4 w-4" /> Counter Signals & Risks
          </div>
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider">Negative Factors / Risks</span>
              <ul className="space-y-1.5 list-disc list-inside text-slate-300 font-sans">
                {issuer.risks.map((item, index) => (
                  <li key={index} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider">Counter Signals</span>
              <ul className="space-y-1.5 list-disc list-inside text-slate-300 font-sans">
                {issuer.counterSignals.map((item, index) => (
                  <li key={index} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider">Unresolved Missing Data</span>
              <ul className="space-y-1.5 list-disc list-inside text-slate-300 font-sans">
                {issuer.missingData.map((item, index) => (
                  <li key={index} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Panel 3: Recommendation / Illustrative Terms */}
        <div className="border border-slate-800 bg-slate-950 p-4 rounded flex flex-col h-[400px]" id="panel-recommendation">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-sky-400 uppercase mb-3 border-b border-slate-900 pb-2">
            <Target className="h-4 w-4" /> AI Structuring Recommendation
          </div>
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[9px] font-mono uppercase text-slate-500 block">Proposed Product</span>
                <span className="font-bold text-white font-sans text-xs">{issuer.recommendation.suggestedProduct}</span>
              </div>
              <div>
                <span className="text-[9px] font-mono uppercase text-slate-500 block">Target Window</span>
                <span className="font-bold text-white text-xs">{issuer.recommendation.indicativeWindow}</span>
              </div>
            </div>

            <div className="space-y-1 bg-slate-900/60 p-2 border border-slate-900 rounded">
              <span className="text-[9px] font-mono uppercase text-sky-400 block font-semibold">Illustrative Structure</span>
              <span className="font-bold text-slate-200 text-[11px] leading-relaxed font-mono">{issuer.recommendation.illustrativeStructure}</span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider">Key Terms Sheet</span>
              <ul className="space-y-1 text-slate-300 font-sans">
                {issuer.recommendation.keyTerms.map((term, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="text-sky-500 font-bold">•</span>
                    <span>{term}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-1.5 border-t border-slate-900 pt-3">
              <div className="flex justify-between">
                <div>
                  <span className="text-[9px] font-mono uppercase text-slate-500 block">Assigned Bankers</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {issuer.recommendation.recommendedTeams.map((team, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 bg-slate-800 text-slate-300 text-[9px] rounded font-mono font-medium">{team}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-2.5">
                <span className="text-[9px] font-mono uppercase text-emerald-400 font-bold block">Recommended Next Action</span>
                <p className="text-slate-200 font-sans mt-0.5 text-xs font-semibold leading-relaxed">{issuer.recommendation.recommendedNextAction}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Knowledge Graph & Node Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" id="explorer-graph-section">
        {/* SVG Interactive graph */}
        <div className="border border-slate-800 bg-slate-950 p-4 rounded lg:col-span-2 flex flex-col h-[380px]" id="interactive-mini-graph">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-mono text-slate-400 font-semibold tracking-wide uppercase">Interactive Relationship Knowledge Graph</span>
            <span className="text-[9px] font-mono text-slate-500 flex items-center gap-1">
              <Info className="h-3 w-3" /> Select any node to inspect relationship details
            </span>
          </div>
          
          <div className="flex-1 border border-slate-900 bg-slate-950/80 rounded relative overflow-hidden" id="mini-canvas-container">
            <svg className="w-full h-full" id="relationship-svg-graph">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="15" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#334155" />
                </marker>
              </defs>
              
              {/* Draw Link lines */}
              {linkLines.map((line) => (
                <g key={line!.id} className="opacity-70 group">
                  <line 
                    x1={line!.x1} 
                    y1={line!.y1} 
                    x2={line!.x2} 
                    y2={line!.y2} 
                    stroke="#1e293b" 
                    strokeWidth="1.5" 
                    markerEnd="url(#arrow)"
                    className="group-hover:stroke-sky-500 transition"
                  />
                  {/* Link Label */}
                  <text 
                    x={(line!.x1 + line!.x2) / 2} 
                    y={(line!.y1 + line!.y2) / 2 - 5}
                    fill="#475569"
                    fontSize={7}
                    textAnchor="middle"
                    className="font-mono"
                  >
                    {line!.label}
                  </text>
                </g>
              ))}

              {/* Draw Nodes */}
              {positionedNodes.map((node) => {
                const isCurrentIssuer = node.id === `node-${issuer.id}`;
                const isSelected = selectedNode?.id === node.id;
                
                let color = "fill-slate-800 stroke-slate-700";
                if (isCurrentIssuer) color = "fill-sky-950 stroke-sky-400 stroke-2";
                else if (node.type === "banker") color = "fill-emerald-950 stroke-emerald-500";
                else if (node.type === "deal") color = "fill-indigo-950 stroke-indigo-500";
                else if (node.type === "investor") color = "fill-amber-950 stroke-amber-500";
                else if (node.type === "peer") color = "fill-purple-950 stroke-purple-500";
                else if (node.type === "event") color = "fill-teal-950 stroke-teal-500";

                return (
                  <g 
                    key={node.id} 
                    onClick={() => handleNodeClick(node)}
                    className="cursor-pointer group"
                  >
                    <circle 
                      cx={node.x} 
                      cy={node.y} 
                      r={isCurrentIssuer ? 24 : 15} 
                      className={`${color} ${isSelected ? "stroke-white stroke-2" : ""} transition group-hover:scale-105`} 
                    />
                    
                    {/* Visual icon/initials */}
                    <text 
                      x={node.x} 
                      y={node.y + 3} 
                      fill="#f8fafc" 
                      fontSize={isCurrentIssuer ? 10 : 8}
                      textAnchor="middle" 
                      className="font-mono font-bold select-none pointer-events-none"
                    >
                      {node.label.slice(0, 2).toUpperCase()}
                    </text>

                    {/* Hover tooltip label */}
                    <text 
                      x={node.x} 
                      y={node.y + (isCurrentIssuer ? 36 : 26)} 
                      fill={isSelected ? "#f8fafc" : "#94a3b8"} 
                      fontSize={8} 
                      textAnchor="middle" 
                      className={`font-mono ${isSelected ? "font-bold" : ""} select-none pointer-events-none`}
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Node Metadata Inspector */}
        <div className="border border-slate-800 bg-slate-950 p-4 rounded flex flex-col h-[380px]" id="node-inspector-panel">
          <span className="text-xs font-mono text-slate-400 font-semibold tracking-wide uppercase mb-3 border-b border-slate-900 pb-2">Node Inspector</span>
          
          {selectedNode ? (
            <div className="flex-1 flex flex-col justify-between text-xs font-mono" id="inspector-content">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] uppercase text-sky-400 font-semibold block">{selectedNode.type} Node</span>
                    <h3 className="text-sm font-bold text-white font-sans mt-0.5">{selectedNode.label}</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedNode(null)}
                    className="text-slate-500 hover:text-slate-300 font-bold"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-2 bg-slate-900/60 p-3 rounded border border-slate-900">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Relationship Diagnostics</div>
                  <p className="text-slate-300 font-sans leading-relaxed text-xs">
                    {selectedNode.type === "issuer" && `Issuer hub representing ${selectedNode.label}. Current predictive opportunity score sits at ${issuer.opportunityScore}%.`}
                    {selectedNode.type === "banker" && `Assigned Sector Coverage Banker. Responsible for maintaining senior advisory relationships and pricing discussions.`}
                    {selectedNode.type === "deal" && `Prior debt underwriting mandate. Acts as structural precedent for yield curve matching and investor allocation.`}
                    {selectedNode.type === "investor" && `Major continental buyer of European high-grade corporate debt. Holds significant portfolio allocation slots.`}
                    {selectedNode.type === "peer" && `Direct sector peer. Competes in capital expenditure budgets and serves as pricing spread proxy.`}
                    {selectedNode.type === "event" && `ESG Sustainable classification. Aligns with central bank corporate sector purchase program mandates.`}
                  </p>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="text-[9px] text-slate-500 uppercase">Interactive Node Controls</div>
                  <div className="flex flex-col gap-1.5">
                    <button className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-850 rounded text-left text-slate-300 flex items-center gap-1.5 transition cursor-pointer">
                      <Users className="h-3.5 w-3.5 text-emerald-400" /> View Connected Bankers
                    </button>
                    <button className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-850 rounded text-left text-slate-300 flex items-center gap-1.5 transition cursor-pointer">
                      <Award className="h-3.5 w-3.5 text-sky-400" /> Inspect Historical Fee Metrics
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-[9px] text-slate-500 border-t border-slate-900 pt-3 flex items-center gap-1">
                <Info className="h-3.5 w-3.5" /> Node Id: {selectedNode.id}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4" id="inspector-placeholder">
              <Layers className="h-8 w-8 text-slate-700 mb-2.5" />
              <p className="text-xs text-slate-500 font-sans max-w-[200px]">
                Click any circle in the relationship network graph to load structural metadata and coverage details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

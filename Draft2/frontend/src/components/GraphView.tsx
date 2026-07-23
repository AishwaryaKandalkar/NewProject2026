/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useMemo } from "react";
import { GraphNode, GraphLink } from "../types";
import axios from "axios";
import {
  Network,
  Search,
  SlidersHorizontal,
  Route
} from "lucide-react";

interface Diagnostics {
  degree: number;
  neighbors: number;
  betweenness: number;
  closeness: number;
}

export default function GraphView() {
  const [graphNodes, setGraphNodes] = useState<GraphNode[]>([]);
  const [graphLinks, setGraphLinks] = useState<GraphLink[]>([]);
  const [activeTypeFilter, setActiveTypeFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [neighborIds, setNeighborIds] = useState<string[]>([]);
  const [diagnostics, setDiagnostics] = useState<Diagnostics | null>(null);

  // Path Analysis State
  const [sourceNodeId, setSourceNodeId] = useState<string>("");
  const [targetNodeId, setTargetNodeId] = useState<string>("");
  const [computedPath, setComputedPath] = useState<string[]>([]);
  const [showOnlyPath, setShowOnlyPath] = useState(false);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Load graph data
  useEffect(() => {
    const loadGraph = async () => {
      try {
        const res = await axios.get("http://localhost:8000/graph");
        setGraphNodes(res.data.nodes);
        setGraphLinks(res.data.edges);
      } catch (err) {
        console.error(err);
      }
    };

    loadGraph();
  }, []);

  const filteredNodes = useMemo(() => {
    return graphNodes.filter(node => {
      // Type Filter
      if (activeTypeFilter !== "ALL" && node.type !== activeTypeFilter.toLowerCase()) return false;

      // Search query
      if (searchQuery.trim() !== "") {
        if (!node.label.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      }
      return true;
    });
  }, [graphNodes, activeTypeFilter, searchQuery]);

  // Generate deterministic coordinates on SVG canvas
  const positionedNodes = filteredNodes;
  const nodeMap = useMemo<Record<string, GraphNode>>(() => {
      return Object.fromEntries(
        positionedNodes.map(node => [node.id, node])
      ) as Record<string, GraphNode>;
    }, [positionedNodes]);

  // Map links to positioned coordinates
  const linkLines = useMemo(() => {
    return graphLinks.map(link => {
      const sourceId = typeof link.source === "string" ? link.source : (link.source as any).id;
      const targetId = typeof link.target === "string" ? link.target : (link.target as any).id;

      const sourceNode = nodeMap[sourceId];
      const targetNode = nodeMap[targetId];

      if (sourceNode && targetNode) {
        // Check if this link lies within our computed relationship path
        let isPathHighlight = false;
        if (computedPath.length > 0) {
          for (let i = 0; i < computedPath.length - 1; i++) {
            if ((computedPath[i] === sourceId && computedPath[i + 1] === targetId) ||
              (computedPath[i] === targetId && computedPath[i + 1] === sourceId)) {
              isPathHighlight = true;
              break;
            }
          }
        }

        const visible = showOnlyPath
          ? isPathHighlight
          : (
              selectedNodeId !== null &&
              (
                sourceId === selectedNodeId ||
                targetId === selectedNodeId ||
                neighborIds.includes(sourceId) ||
                neighborIds.includes(targetId)
              )
            );

        return {
          id: `${sourceId}-${targetId}`,
          x1: sourceNode.x,
          y1: sourceNode.y,
          x2: targetNode.x,
          y2: targetNode.y,
          label: link.label,
          isHighlight: isPathHighlight,
          visible
        };
      }
      return null;
    }).filter( (line): line is NonNullable<typeof line> => line !== null);
      }, [
        graphLinks,
        nodeMap,
        computedPath,
        selectedNodeId,
        neighborIds
    ]);
  // Click on a node
  const handleNodeClick = async (node: GraphNode) => {
    if (showOnlyPath) return;
    try {
      setSelectedNodeId(node.id);

      const [diagRes, neighborRes] = await Promise.all([
        axios.get(`http://localhost:8000/graph/node/${node.id}/diagnostics`),
        axios.get(`http://localhost:8000/graph/node/${node.id}/neighbors`)
      ]);

      setDiagnostics(diagRes.data);
      setNeighborIds(neighborRes.data.neighbors.map((n: any) => n.id));
    } catch (err) {
      console.error(err);
    }
  };

  const selectedNode = useMemo(() => {
    return graphNodes.find(n => n.id === selectedNodeId) || null;
  }, [graphNodes, selectedNodeId]);

  // Simple path analysis simulator (BF Search for short relationship paths)
  const handleRunPathAnalysis = async () => {
    if (!sourceNodeId || !targetNodeId) return;

    try {
      const res = await axios.post("http://localhost:8000/graph/path", {
        source: sourceNodeId,
        target: targetNodeId
      });

      const path = res.data.path ?? [];
      const pathNodes = graphNodes.filter(n => path.includes(n.id));

      if (pathNodes.length > 0) {
        const centerX =
          pathNodes.reduce((sum, n) => sum + n.x, 0) / pathNodes.length;

        const centerY =
          pathNodes.reduce((sum, n) => sum + n.y, 0) / pathNodes.length;

        setScale(1.8);

        setPan({
          x: 500 - centerX * 1.8,
          y: 260 - centerY * 1.8
        });
      }
      setComputedPath(path);
      setShowOnlyPath(path.length > 0);
    } catch (err) {
      console.error(err);
      setComputedPath([]);
    }
  };

  const handleClearPath = () => {
    setSourceNodeId("");
    setTargetNodeId("");

    setComputedPath([]);
    setShowOnlyPath(false);

    setSelectedNodeId(null);
    setNeighborIds([]);
    setDiagnostics(null);
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="space-y-6" id="graph-view-root">
      {/* Search and Filters bar */}
      <div className="border border-slate-800 bg-slate-950 p-4 rounded flex flex-col md:flex-row justify-between items-center gap-4" id="graph-filters-bar">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 font-semibold uppercase">
            <SlidersHorizontal className="h-4 w-4 text-sky-400" /> Filter Nodes:
          </div>
          <div className="flex bg-slate-900 rounded p-0.5 border border-slate-800" id="graph-type-filter-group">
            {["ALL", "ISSUER", "BANKER", "DEAL", "INVESTOR", "PEER"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTypeFilter(tab)}
                className={`px-2.5 py-1 text-[10px] font-mono font-medium rounded transition cursor-pointer ${
                  activeTypeFilter === tab ? "bg-sky-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full md:w-64" id="graph-search">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search network nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded pl-8 pr-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 outline-none focus:border-sky-500 transition"
          />
        </div>
      </div>

      {/* Main Workspace split */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4" id="graph-workspace">
        {/* Left Control Panel: Path Analysis & Controls */}
        <div className="space-y-4 lg:col-span-1" id="graph-controls-panel">
          {/* Path Analysis Widget */}
          <div className="border border-slate-800 bg-slate-950 p-4 rounded space-y-4" id="path-analysis-widget">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-sky-400 uppercase border-b border-slate-900 pb-2">
              <Route className="h-4 w-4" /> Relationship Path Analysis
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-[9px] uppercase text-slate-500 font-bold block">Source Entity</label>
                <select
                  value={sourceNodeId}
                  onChange={(e) => setSourceNodeId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none"
                >
                  <option value="">Select entity...</option>
                  {graphNodes.map(n => (
                    <option key={n.id} value={n.id}>{n.label} ({n.type})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase text-slate-500 font-bold block">Target Destination</label>
                <select
                  value={targetNodeId}
                  onChange={(e) => setTargetNodeId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none"
                >
                  <option value="">Select entity...</option>
                  {graphNodes.map(n => (
                    <option key={n.id} value={n.id}>{n.label} ({n.type})</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex gap-1.5">
                <button
                  onClick={handleRunPathAnalysis}
                  className="flex-1 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded transition cursor-pointer text-center"
                >
                  RUN SHORTEST PATH
                </button>
                <button
                  onClick={handleClearPath}
                  className="py-1.5 px-3.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 text-xs rounded transition cursor-pointer"
                >
                  CLEAR
                </button>
              </div>

              {computedPath.length > 0 && (
                <div className="space-y-2 p-2 bg-slate-900/60 border border-slate-900 rounded mt-3">
                  <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-wider block">Shortest Relationship Identified</span>
                  <div className="space-y-1 font-sans text-slate-300 text-[11px]">
                    {computedPath.map((nodeId, idx) => {
                      const matchedNode = graphNodes.find(n => n.id === nodeId);
                      return (
                        <div key={nodeId} className="flex items-center gap-1.5">
                          <span className="font-mono text-slate-500 text-[9px] font-bold">#{idx + 1}</span>
                          <span className="font-semibold text-white">{matchedNode?.label}</span>
                          <span className="text-[9px] font-mono text-slate-500">({matchedNode?.type})</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Node details / inspector */}
          <div className="border border-slate-800 bg-slate-950 p-4 rounded h-[230px]" id="graph-node-inspector">
            <span className="text-xs font-mono text-slate-400 font-bold uppercase block mb-3 border-b border-slate-900 pb-2">Node Diagnostics</span>
            {selectedNode ? (
              <div className="font-mono text-xs space-y-3" id="diagnostics-box">
                <div>
                  <span className="text-[9px] uppercase text-sky-400 block">{selectedNode.type} Node</span>
                  <h4 className="text-sm font-bold text-white font-sans mt-0.5">{selectedNode.label}</h4>
                </div>
                {diagnostics && (
                  <div className="space-y-2 mt-3 text-xs">
                    <div>Degree: {diagnostics.degree}</div>
                    <div>Neighbors: {diagnostics.neighbors}</div>
                    <div>Betweenness: {diagnostics.betweenness}</div>
                    <div>Closeness: {diagnostics.closeness}</div>
                  </div>
                )}
                <div className="text-[9px] text-slate-500 pt-1.5">
                  ID: {selectedNode.id}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-3 h-full pb-8">
                <Network className="h-6 w-6 text-slate-700 mb-2" />
                <p className="text-[11px] text-slate-500 font-sans">
                  Click on any node in the canvas network workspace to display connection diagnostic telemetry logs.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Canvas: Large SVG Interactive Graph Workspace */}
        <div className="border border-slate-800 bg-slate-950 p-4 rounded lg:col-span-3 flex flex-col h-[520px]" id="large-network-panel">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-mono text-slate-400 font-semibold tracking-wide uppercase">Interactive Network schematic ({filteredNodes.length} visible entities)</span>
            <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block"></span> Issuer</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Banker</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span> Deal</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Investor</span>
            </div>
          </div>

          <div className="flex-1 border border-slate-900 bg-slate-950/80 rounded relative overflow-hidden" id="large-canvas-box">
            <svg
              className="w-full h-full"
              id="large-graph-svg"
              onWheel={(e) => {
                e.preventDefault();

                const zoom = e.deltaY < 0 ? 1.1 : 0.9;

                setScale(s => Math.min(4, Math.max(0.4, s * zoom)));
              }}
              onMouseDown={(e) => {
                setIsDragging(true);
                setDragStart({
                  x: e.clientX - pan.x,
                  y: e.clientY - pan.y,
                });
              }}

              onMouseMove={(e) => {
                if (!isDragging) return;

                setPan({
                  x: e.clientX - dragStart.x,
                  y: e.clientY - dragStart.y,
                });
              }}

              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
            > 
              <defs>
                <marker id="large-arrow" viewBox="0 0 10 10" refX="16" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#1e293b" />
                </marker>
                <marker id="highlight-arrow" viewBox="0 0 10 10" refX="16" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#0284c7" />
                </marker>
              </defs>
              <g
                transform={`translate(${pan.x} ${pan.y}) scale(${scale})`}
              >

              {/* Link lines */}
              {linkLines.filter(line => line?.visible)
                .map(line => (
                  <g key={line.id} className="opacity-80">
                    <line
                      x1={line.x1}
                      y1={line.y1}
                      x2={line.x2}
                      y2={line.y2}
                      stroke={line.isHighlight ? "#22c55e" : "#1e293b"}
                      strokeWidth={line.isHighlight ? 4 : 1.5}
                      strokeDasharray={line.isHighlight ? "none" : "3 3"}
                      className={line.isHighlight ? "animate-pulse" : ""}
                      markerEnd={line.isHighlight ? "url(#highlight-arrow)" : "url(#large-arrow)"}
                    />
                    <text
                      x={(line.x1 + line.x2) / 2}
                      y={(line.y1 + line.y2) / 2 - 5}
                      fill={line.isHighlight ? "#38bdf8" : "#475569"}
                      fontSize={7}
                      textAnchor="middle"
                      className="font-mono font-semibold"
                    >
                      {line.label}
                    </text>
                  </g>
                ))}

              {/* Node circles */}
              {positionedNodes.map(node => {
                if (showOnlyPath && !computedPath.includes(node.id)) {
                  return null;
                }
                const isSelected = selectedNodeId === node.id;
                const isPathNode = computedPath.includes(node.id);
                const isNeighbor = neighborIds.includes(node.id);

                const faded =
                  selectedNodeId !== null &&
                  node.id !== selectedNodeId &&
                  !isNeighbor;

                let color = "fill-slate-800 stroke-slate-700";
                if (node.type === "issuer") color = "fill-sky-950 stroke-sky-400 stroke-2";
                else if (node.type === "banker") color = "fill-emerald-950 stroke-emerald-500";
                else if (node.type === "deal") color = "fill-indigo-950 stroke-indigo-500";
                else if (node.type === "investor") color = "fill-amber-950 stroke-amber-500";
                else if (node.type === "peer") color = "fill-purple-950 stroke-purple-500";
                else if (node.type === "event") color = "fill-teal-950 stroke-teal-500";
                
                return (
                  <g
                    key={node.id}
                    onClick={() => handleNodeClick(node)}
                    className={`cursor-pointer group ${
                      faded ? "opacity-20" : "opacity-100"
                    }`}
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.type === "issuer" ? 22 : 14}
                      className={`${color} ${
                        isSelected
                          ? "stroke-white stroke-2"
                          : isPathNode
                          ? "stroke-yellow-400 stroke-[3]"
                          : ""
                      }`}
                    />

                    <text
                      x={node.x}
                      y={node.y + 3}
                      fill="#f8fafc"
                      fontSize={node.type === "issuer" ? 9 : 7}
                      textAnchor="middle"
                      className="font-mono font-bold select-none pointer-events-none"
                    >
                      {showOnlyPath
                      ? computedPath.indexOf(node.id) + 1
                      : node.label.slice(0,2).toUpperCase()}
                    </text>

                    {/* Node Label Text */}
                    {(!selectedNodeId ||
                    isSelected ||
                    isNeighbor ||
                    isPathNode) && (
                    <text
                      x={node.x}
                      y={node.y + 24}
                      fill={
                        isSelected
                          ? "#f8fafc"
                          : isPathNode
                          ? "#34d399"
                          : "#94a3b8"
                      }
                      fontSize={8}
                      textAnchor="middle"
                      className={`font-mono select-none pointer-events-none ${
                        isSelected || isPathNode ? "font-bold" : ""
                      }`}
                    >
                      {node.label}
                    </text>
                  )}
                  </g>
                );
              })}
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

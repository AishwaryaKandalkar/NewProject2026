/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  CheckSquare, 
  Square, 
  PlayCircle, 
  CheckCircle, 
  Clock, 
  User, 
  Calendar,
  AlertCircle,
  TrendingUp,
  Inbox
} from "lucide-react";
import { MyAction } from "../types";

interface MyActionsProps {
  actions: MyAction[];
  onUpdateStatus: (id: string, status: "PENDING" | "IN_PROGRESS" | "COMPLETED") => void;
  onSelectIssuer: (id: string) => void;
}

export default function MyActions({ actions, onUpdateStatus, onSelectIssuer }: MyActionsProps) {
  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "IN_PROGRESS" | "COMPLETED">("ALL");

  const filteredActions = actions.filter(action => {
    if (activeTab === "ALL") return true;
    return action.status === activeTab;
  });

  return (
    <div className="space-y-6" id="my-actions-root">
      {/* Title Header */}
      <div className="border border-slate-800 bg-slate-950 p-4 rounded flex justify-between items-center" id="actions-header">
        <div className="flex items-center gap-2.5">
          <CheckSquare className="h-5 w-5 text-emerald-400" />
          <div>
            <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Origination Task Queue</h2>
            <p className="text-xs text-slate-400 font-sans">Mandate tasks, client pitches preparation, and senior memorandum reviews assigned to your deal desks.</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-900 rounded p-0.5 border border-slate-800 font-mono text-xs" id="actions-tabs">
          {["ALL", "PENDING", "IN_PROGRESS", "COMPLETED"].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-2.5 py-1 text-[10px] font-mono rounded transition cursor-pointer ${
                activeTab === tab ? "bg-slate-800 text-sky-400 font-bold" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {filteredActions.length === 0 ? (
        <div className="border border-slate-900 bg-slate-950/40 p-12 rounded text-center" id="actions-empty">
          <Inbox className="h-8 w-8 text-slate-700 mx-auto mb-3" />
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase">Task Queue Clear</h3>
          <p className="text-xs text-slate-500 font-sans mt-1">No outstanding action deliverables found for this filter tab.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="actions-grid">
          {filteredActions.map(action => (
            <div 
              key={action.id} 
              className={`border p-4 rounded flex flex-col justify-between space-y-4 hover:border-slate-700 transition ${
                action.status === "COMPLETED" ? "border-slate-900 bg-slate-950/40" : "border-slate-800 bg-slate-950"
              }`}
            >
              {/* Task Header */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-1.5 py-0.5 bg-slate-850 text-slate-300 rounded text-[8px] font-mono font-bold tracking-wider uppercase">
                      {action.type}
                    </span>
                    <span 
                      onClick={() => onSelectIssuer(action.issuerId)}
                      className="text-xs font-mono font-bold text-slate-200 hover:text-sky-400 transition cursor-pointer"
                    >
                      {action.issuerName}
                    </span>
                  </div>

                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold ${
                    action.status === "COMPLETED" ? "bg-emerald-950 text-emerald-400 border border-emerald-900/30" :
                    action.status === "IN_PROGRESS" ? "bg-sky-950 text-sky-400 border border-sky-900/30" :
                    "bg-amber-950 text-amber-400 border border-amber-900/30"
                  }`}>
                    {action.status}
                  </span>
                </div>
                <h3 className="text-xs font-mono font-bold text-white">{action.title}</h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">{action.description}</p>
              </div>

              {/* Task Footer Meta and Controls */}
              <div className="border-t border-slate-900 pt-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 text-[10px] font-mono text-slate-500">
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> {action.owner}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Due: {action.dueDate}</span>
                </div>

                <div className="flex gap-1 w-full md:w-auto" id="task-action-triggers">
                  {action.status !== "PENDING" && (
                    <button 
                      onClick={() => onUpdateStatus(action.id, "PENDING")}
                      className="p-1 px-2 hover:bg-slate-900 text-slate-400 hover:text-white rounded transition cursor-pointer border border-transparent hover:border-slate-800"
                    >
                      PENDING
                    </button>
                  )}
                  {action.status !== "IN_PROGRESS" && (
                    <button 
                      onClick={() => onUpdateStatus(action.id, "IN_PROGRESS")}
                      className="p-1 px-2 hover:bg-slate-900 text-sky-400 hover:text-sky-300 rounded transition cursor-pointer border border-transparent hover:border-slate-800"
                    >
                      IN PROGRESS
                    </button>
                  )}
                  {action.status !== "COMPLETED" && (
                    <button 
                      onClick={() => onUpdateStatus(action.id, "COMPLETED")}
                      className="p-1 px-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-400 rounded transition cursor-pointer border border-emerald-800/20"
                    >
                      COMPLETE
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import {
  FileText,
  Download,
  CheckCircle2,
  Loader2,
  Calendar,
  Layers,
} from "lucide-react";

export default function Reports() {
  const [generatingKey, setGeneratingKey] = useState<string | null>(null);
  const [completedKeys, setCompletedKeys] = useState<string[]>([]);

  const reportsList = [
    {
      id: "rep-weekly",
      title: "Weekly Opportunity Report",
      description: "Aggregated corporate origination intelligence covering newly flagged European candidates and rating upgrades.",
      formats: ["PDF", "Excel"],
      size: "2.4 MB",
      frequency: "Every Monday 06:00"
    },
    {
      id: "rep-sector",
      title: "Sector Distribution & Capex Analysis",
      description: "Detailed funding product mix and leverage ratios analyzed for Industrials, Tech, and Energy corporations.",
      formats: ["PDF", "PPT"],
      size: "4.8 MB",
      frequency: "Monthly (Last day)"
    },
    {
      id: "rep-country",
      title: "Country Sovereign Arbitrage Briefing",
      description: "Sovereign yield movements and swap-arbitrage pricing windows monitored for France, Germany, and Benelux.",
      formats: ["PDF"],
      size: "1.2 MB",
      frequency: "Bi-Weekly"
    },
    {
      id: "rep-watchlist",
      title: "Watchlist Engagement Brief",
      description: "Diagnostic report mapping coverage notes, scheduled outreach actions, and relationship gaps.",
      formats: ["Excel"],
      size: "820 KB",
      frequency: "Ad-hoc (Generated on demand)"
    }
  ];

  const handleGenerate = async (id: string, format: string) => {
    const buttonKey = `${id}-${format}`;
    setGeneratingKey(buttonKey);
    setCompletedKeys((prev) => prev.filter((key) => !key.startsWith(`${id}-`)));

    try {
      const response = await fetch("/api/reports/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reportId: id, format }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate report");
      }

      const payload = await response.json() as {
        filename: string;
        contentType: string;
        base64: string;
      };

      const binary = atob(payload.base64);
      const bytes = new Uint8Array(binary.length);
      for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
      }

      const blob = new Blob([bytes], { type: payload.contentType });
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = objectUrl;
      link.download = payload.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);

      setCompletedKeys((prev) => [...prev.filter((key) => !key.startsWith(`${id}-`)), buttonKey]);
    } catch (error) {
      console.error("Report generation failed", error);
    } finally {
      setGeneratingKey(null);
    }
  };

  return (
    <div className="space-y-6" id="reports-root">
      {/* Title block */}
      <div className="border border-slate-800 bg-slate-950 p-4 rounded flex justify-between items-center" id="reports-header">
        <div>
          <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="h-5 w-5 text-sky-400" /> Executive Document Export Bureau
          </h2>
          <p className="text-xs text-slate-400 font-sans">Compile, compile, and download formal presentation-ready dossiers for investment committee review.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="reports-grid">
        {reportsList.map(rep => {
          return (
            <div 
              key={rep.id}
              className="border border-slate-800 bg-slate-950 p-4 rounded space-y-4 hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2 border-b border-slate-900 pb-2">
                  <h3 className="text-xs font-mono font-bold text-white uppercase">{rep.title}</h3>
                  <span className="text-[9px] font-mono text-slate-500 uppercase">{rep.frequency}</span>
                </div>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">{rep.description}</p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> File size: {rep.size}</span>
                  <span className="flex items-center gap-1"><Layers className="h-3.5 w-3.5" /> Formats: {rep.formats.join(", ")}</span>
                </div>

                <div className="flex gap-1.5" id={`report-actions-${rep.id}`}>
                  {rep.formats.map(fmt => {
                    const buttonKey = `${rep.id}-${fmt}`;
                    const isGenerating = generatingKey === buttonKey;
                    const isCompleted = completedKeys.includes(buttonKey);

                    return (
                      <button
                        key={fmt}
                        disabled={isGenerating}
                        onClick={() => handleGenerate(rep.id, fmt)}
                        className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 text-[10px] font-mono font-semibold rounded transition flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" /> COMPILING...
                          </>
                        ) : isCompleted ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> DOWNLOAD {fmt}
                          </>
                        ) : (
                          <>
                            <Download className="h-3.5 w-3.5 text-sky-400" /> GENERATE {fmt}
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Copy, Download, Check, Workflow, Server, Zap, ExternalLink } from 'lucide-react';
import { N8N_WORKFLOW_TEMPLATES } from '../utils/n8nWorkflows';

export default function N8nLibraryModal() {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (id, json) => {
    navigator.clipboard.writeText(JSON.stringify(json, null, 2));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (name, json) => {
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/[^a-zA-Z0-9]/g, '_')}_n8n_workflow.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
              n8n Automation Blueprints
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">n8n Home Server Workflow Templates</h2>
          <p className="text-sm text-slate-400">
            Kumpulan blueprint alur kerja n8n resmi yang siap diimpor langsung ke n8n Home Server Mas Toti (<code className="text-orange-400">http://100.92.106.96:5678</code>).
          </p>
        </div>

        <a
          href="http://100.92.106.96:5678"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs shadow-lg shadow-orange-600/20 transition-all"
        >
          <Server className="w-4 h-4" />
          <span>Buka n8n Home Server</span>
          <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
        </a>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {N8N_WORKFLOW_TEMPLATES.map((wf) => (
          <div
            key={wf.id}
            className="bg-slate-900/60 border border-slate-800/80 hover:border-orange-500/40 rounded-2xl p-6 transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2.5">
                  <Workflow className="w-5 h-5 text-orange-400" />
                  <h3 className="text-base font-bold text-white">{wf.name}</h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {wf.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{wf.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(wf.id, wf.workflowJson)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all"
                >
                  {copiedId === wf.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === wf.id ? 'Tersalin!' : 'Copy JSON'}</span>
                </button>
                <button
                  onClick={() => handleDownload(wf.name, wf.workflowJson)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 text-xs font-medium transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400 border-t border-slate-800/80">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Trigger: <strong className="text-slate-200">{wf.trigger}</strong>
              </span>
              <span>•</span>
              <span>Jumlah Nodes: <strong className="text-slate-200">{wf.nodesCount} Steps</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

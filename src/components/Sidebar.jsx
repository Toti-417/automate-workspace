import React from 'react';
import {
  FileText,
  Users,
  Receipt,
  Sparkles,
  Radio,
  Award,
  ClipboardList,
  Send,
  Layers,
  DollarSign,
  Workflow
} from 'lucide-react';

export default function Sidebar({ activeTool, setActiveTool }) {
  const menuCategories = [
    {
      category: '📄 DOKUMEN & PDF',
      items: [
        { id: 'doc-pdf', name: 'Smart Doc to PDF', icon: FileText, badge: 'Modul 1' },
        { id: 'pdf-merger', name: 'Multi-PDF Merger', icon: Layers, badge: 'Modul 9' }
      ]
    },
    {
      category: '👥 HR & REKRUTMEN',
      items: [
        { id: 'cv-screener', name: 'TalentScan (CV Screener)', icon: Users, badge: 'Modul 2' },
        { id: 'certificate-gen', name: 'CertiSend (Auto Certificate)', icon: Award, badge: 'Modul 6' }
      ]
    },
    {
      category: '💰 KEUANGAN & PEMBUKUAN',
      items: [
        { id: 'invoice-ocr', name: 'BillToSheet (Invoice OCR)', icon: Receipt, badge: 'Modul 3' },
        { id: 'reimbursement', name: 'ExpensifyLite (Kasbon)', icon: DollarSign, badge: 'Modul 10' }
      ]
    },
    {
      category: '📊 SPREADSHEET & TELEMETRI',
      items: [
        { id: 'data-cleaner', name: 'DataPolish (Excel Sanitizer)', icon: Sparkles, badge: 'Modul 4' },
        { id: 'telemetry', name: 'TelcoPulse (Regex Telemetry)', icon: Radio, badge: 'Signature' }
      ]
    },
    {
      category: '⚡ KOMUNIKASI & OPERASIONAL',
      items: [
        { id: 'meeting-summary', name: 'MeetSummary (MoM Rapat)', icon: ClipboardList, badge: 'Modul 7' },
        { id: 'webhook-notifier', name: 'NotifBot (WA/Telegram Alert)', icon: Send, badge: 'Modul 8' }
      ]
    },
    {
      category: '⚙️ N8N WORKFLOW BLUEPRINTS',
      items: [
        { id: 'n8n-library', name: 'n8n Home Server Blueprints', icon: Workflow, badge: '24/7 Engine' }
      ]
    }
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-slate-950/60 border-r border-slate-800/80 min-h-[calc(100vh-61px)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        {menuCategories.map((cat, idx) => (
          <div key={idx} className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase px-3">
              {cat.category}
            </span>
            <div className="space-y-0.5 mt-1">
              {cat.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTool === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTool(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/25'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-md ${
                        isActive
                          ? 'bg-blue-700/60 text-white'
                          : item.badge === 'Signature'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-800/80 mt-6 text-[11px] text-slate-500 px-2 space-y-1">
        <div>Dibuat oleh: <span className="text-slate-300 font-semibold">Toti Putra Pratama</span></div>
        <div className="text-[10px] text-slate-600">Telkomsel / Huawei Telemetry & Automation</div>
      </div>
    </aside>
  );
}

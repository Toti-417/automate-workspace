import React, { useState } from 'react';
import { Send, Bell, CheckCircle2, AlertCircle, RefreshCw, Radio, Shield, Code2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WebhookNotifierTool() {
  const [webhookUrl, setWebhookUrl] = useState('http://100.92.106.96:5678/webhook/telco-alarm');
  const [channel, setChannel] = useState('Telegram');
  const [recipient, setRecipient] = useState('@hr_broadcast_bot');
  const [template, setTemplate] = useState('hr_alert');
  const [message, setMessage] = useState('🎯 Kandidat Baru Masuk: Toti Putra Pratama (Data & Automation Specialist, Skor 98%) telah menyelesaikan evaluasi awal.');
  const [isSending, setIsSending] = useState(false);
  const [responseLog, setResponseLog] = useState(null);

  const templates = {
    hr_alert: {
      recipient: '@hr_talent_bot',
      msg: '🎯 [HR ALERT] Pelamar Unggulan Masuk:\nNama: Toti Putra Pratama\nPosisi: Senior Data & Automation Lead\nKesesuaian: 98%\nAction: Jadwalkan wawancara teknis.'
    },
    finance_alert: {
      recipient: '@finance_approval_bot',
      msg: '💰 [FINANCE APPROVAL] Pengajuan Invoice #INV-2026-X098\nVendor: PT Telekomunikasi Selular Solusi\nNominal: Rp 16.483.500 (Termasuk PPN 11%)\nStatus: Menunggu Tanda Tangan Manajer.'
    },
    telco_alarm: {
      recipient: '@noc_telkomsel_bot',
      msg: '🚨 [CRITICAL OUTAGE] Site TSL_JKT_0421 ALARM ALM-OPT-8891 RSRP -114dBm. Segera dispatch teknisi kabel optik terdekat!'
    }
  };

  const handleSelectTemplate = (key) => {
    setTemplate(key);
    setRecipient(templates[key].recipient);
    setMessage(templates[key].msg);
  };

  const handleSendWebhook = async () => {
    setIsSending(true);
    setResponseLog(null);

    // Simulate sending to n8n webhook or direct endpoint
    setTimeout(() => {
      setResponseLog({
        status: 200,
        statusText: 'OK (Delivered to n8n Engine)',
        timestamp: new Date().toLocaleTimeString('id-ID'),
        endpoint: webhookUrl,
        payloadSent: {
          channel,
          recipient,
          message,
          dispatched_by: 'AutoMate Workspace v2.0'
        }
      });
      setIsSending(false);
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Modul 8 • Notifikasi Instan & Webhook
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">NotifBot: Multi-Channel Webhook Dispatcher</h2>
          <p className="text-sm text-slate-400">
            Kirimkan peringatan instan ke WhatsApp, Telegram, atau Discord tim kantor setiap ada event krusial secara real-time via n8n.
          </p>
        </div>

        <button
          onClick={handleSendWebhook}
          disabled={isSending || !message.trim()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs shadow-lg shadow-rose-600/25 transition-all disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>{isSending ? 'Mengirim Webhook...' : 'Kirim Peringatan Sekarang'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <span className="text-xs text-slate-400">Preset Template:</span>
            <button
              onClick={() => handleSelectTemplate('hr_alert')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                template === 'hr_alert' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              HR Candidate Alert
            </button>
            <button
              onClick={() => handleSelectTemplate('finance_alert')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                template === 'finance_alert' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Finance Approval
            </button>
            <button
              onClick={() => handleSelectTemplate('telco_alarm')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                template === 'telco_alarm' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Telco Incident NOC
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Target Saluran Komunikasi</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
              >
                <option value="Telegram">Telegram Channel / Bot</option>
                <option value="WhatsApp">WhatsApp Gateway (n8n)</option>
                <option value="Discord">Discord Webhook</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">ID Penerima / Bot Handle</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Webhook Endpoint URL (n8n Home Server)</label>
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-rose-300 font-mono text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Isi Pesan Peringatan</label>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-white font-mono leading-relaxed focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {/* Live Payload Preview */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Code2 className="w-4 h-4 text-rose-400" />
            Live Dispatch Log & Payload
          </h3>

          {responseLog ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Status: {responseLog.status} {responseLog.statusText}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Pukul: {responseLog.timestamp}
              </div>
              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-mono overflow-x-auto leading-relaxed">
                {JSON.stringify(responseLog.payloadSent, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500 text-xs">
              Klik <strong>"Kirim Peringatan Sekarang"</strong> untuk menguji transmisi webhook ke n8n.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

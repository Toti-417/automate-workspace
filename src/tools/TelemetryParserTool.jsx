import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Radio, Activity, AlertTriangle, ShieldCheck, FileSpreadsheet, Sparkles, Filter, Terminal } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SAMPLE_TELCO_LOGS } from '../utils/sampleData';

export default function TelemetryParserTool() {
  const [rawLogs, setRawLogs] = useState(SAMPLE_TELCO_LOGS);
  const [parsedRows, setParsedRows] = useState([]);
  const [isParsing, setIsParsing] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');

  const handleParseLogs = () => {
    setIsParsing(true);
    setTimeout(() => {
      const lines = rawLogs.split('\n').filter(l => l.trim().length > 0);
      const results = [];

      lines.forEach((line, idx) => {
        // Regex patterns for telco logs
        const timestampMatch = line.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
        const severityMatch = line.match(/\[(CRITICAL|WARNING|INFO|ERROR)\]/);
        const cellIdMatch = line.match(/CELL_ID=([A-Z0-9_]+)/);
        const alarmMatch = line.match(/ALARM_CODE=([A-Z0-9\-]+)/);
        const rsrpMatch = line.match(/RSRP=([\-0-9.]+dBm)/);
        const sinrMatch = line.match(/SINR=([\-0-9.]+dB)/);
        const vswrMatch = line.match(/VSWR=([\-0-9.]+)/);
        const fiberMatch = line.match(/FIBER_LOSS=([\-0-9.]+dB)/);
        const statusMatch = line.match(/STATUS=([A-Z]+)/);
        const vendorMatch = line.match(/VENDOR=([A-Z]+)/);

        results.push({
          id: idx + 1,
          timestamp: timestampMatch ? timestampMatch[0] : 'N/A',
          severity: severityMatch ? severityMatch[1] : 'INFO',
          cellId: cellIdMatch ? cellIdMatch[1] : 'UNKNOWN_CELL',
          alarmCode: alarmMatch ? alarmMatch[1] : '-',
          metric: rsrpMatch ? `RSRP: ${rsrpMatch[1]}` : (vswrMatch ? `VSWR: ${vswrMatch[1]}` : (fiberMatch ? `Fiber Loss: ${fiberMatch[1]}` : '-')),
          sinr: sinrMatch ? sinrMatch[1] : '-',
          status: statusMatch ? statusMatch[1] : 'NORMAL',
          vendor: vendorMatch ? vendorMatch[1] : 'GENERIC'
        });
      });

      setParsedRows(results);
      setIsParsing(false);
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
    }, 350);
  };

  const handleExportExcel = () => {
    if (parsedRows.length === 0) return;
    const ws = XLSX.utils.json_to_sheet(parsedRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Telco Telemetry Report');
    XLSX.writeFile(wb, `Telco_Incident_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const filteredRows = parsedRows.filter(r => {
    if (selectedSeverity === 'ALL') return true;
    return r.severity === selectedSeverity;
  });

  const criticalCount = parsedRows.filter(r => r.severity === 'CRITICAL').length;
  const warningCount = parsedRows.filter(r => r.severity === 'WARNING').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Modul 5 • Signature Telco Telemetri
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">TelcoPulse: Multi-Vendor Telemetry Log Parser</h2>
          <p className="text-sm text-slate-400">
            Keahlian signature Toti: Otomasi parsing ribuan baris log telemetri BTS, VSWR, dan alarm fiber optic (Huawei / Ericsson / ZTE) menjadi tabel analitik instan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setRawLogs(SAMPLE_TELCO_LOGS)}
            className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-xl"
          >
            Reset Log
          </button>
          <button
            onClick={handleExportExcel}
            disabled={parsedRows.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-40"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Editor & Execution */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-400" />
            Input Log Telemetri / NMS Raw Feed
          </label>
          <button
            onClick={handleParseLogs}
            disabled={isParsing || !rawLogs.trim()}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs shadow-lg shadow-amber-600/25 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isParsing ? 'Mengekstrak Telemetri...' : 'Jalankan Regex Parser'}</span>
          </button>
        </div>

        <textarea
          rows={5}
          value={rawLogs}
          onChange={(e) => setRawLogs(e.target.value)}
          placeholder="Paste raw telemetry logs here..."
          className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3.5 text-xs text-amber-200/90 font-mono leading-relaxed focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Results View */}
      {parsedRows.length > 0 && (
        <div className="space-y-4">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Total Log Diproses</span>
              <span className="text-xl font-bold text-white">{parsedRows.length} Events</span>
            </div>
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/40">
              <span className="text-[11px] text-rose-300 block">Critical Outage</span>
              <span className="text-xl font-bold text-rose-400">{criticalCount} Sites</span>
            </div>
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40">
              <span className="text-[11px] text-amber-300 block">Degraded / Warning</span>
              <span className="text-xl font-bold text-amber-400">{warningCount} Sites</span>
            </div>
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40">
              <span className="text-[11px] text-emerald-300 block">Status Normal</span>
              <span className="text-xl font-bold text-emerald-400">{parsedRows.length - criticalCount - warningCount} Sites</span>
            </div>
          </div>

          {/* Table with Filter */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Filter Tingkat Bahaya:</span>
                {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map(sev => (
                  <button
                    key={sev}
                    onClick={() => setSelectedSeverity(sev)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      selectedSeverity === sev
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
              <span className="text-xs text-slate-400">{filteredRows.length} entri ditampilkan</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3">Waktu</th>
                    <th className="p-3">Severity</th>
                    <th className="p-3">Cell ID (BTS)</th>
                    <th className="p-3">Alarm Code</th>
                    <th className="p-3">Metrik Sinyal / Kabel</th>
                    <th className="p-3">Vendor</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {filteredRows.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/30">
                      <td className="p-3 text-slate-400">{r.timestamp}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                          r.severity === 'WARNING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {r.severity}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-white">{r.cellId}</td>
                      <td className="p-3 text-amber-300">{r.alarmCode}</td>
                      <td className="p-3 text-cyan-300">{r.metric}</td>
                      <td className="p-3 text-slate-300">{r.vendor}</td>
                      <td className="p-3">
                        <span className={`font-semibold ${
                          r.status === 'OUTAGE' || r.status === 'DOWN' ? 'text-rose-400' :
                          r.status === 'DEGRADED' ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

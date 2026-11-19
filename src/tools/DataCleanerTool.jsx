import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Sparkles, Trash2, CheckCircle2, Download, RefreshCw, AlertCircle, FileSpreadsheet } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SAMPLE_DIRTY_DATA } from '../utils/sampleData';

export default function DataCleanerTool() {
  const [dirtyData, setDirtyData] = useState(SAMPLE_DIRTY_DATA);
  const [cleanedData, setCleanedData] = useState(null);
  const [cleaningStats, setCleaningStats] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const cleanData = () => {
    setIsProcessing(true);
    setTimeout(() => {
      let duplicatesCount = 0;
      let phoneNormalizedCount = 0;
      let caseFixedCount = 0;

      const seen = new Set();
      const cleaned = [];

      dirtyData.forEach(row => {
        // 1. Trim all strings
        const nameTrimmed = (row.name || '').trim();
        const cityTrimmed = (row.city || '').trim();
        const emailTrimmed = (row.email || '').trim().toLowerCase();
        
        // 2. Normalize Phone Number to E.164 (+628xxxx)
        let phoneRaw = (row.phone || '').replace(/[^0-9]/g, '');
        let phoneClean = phoneRaw;
        if (phoneRaw.startsWith('08')) {
          phoneClean = '628' + phoneRaw.slice(2);
          phoneNormalizedCount++;
        } else if (phoneRaw.startsWith('8')) {
          phoneClean = '628' + phoneRaw.slice(1);
          phoneNormalizedCount++;
        } else if (phoneRaw.startsWith('628')) {
          phoneNormalizedCount++;
        }
        const formattedPhone = '+' + phoneClean;

        // 3. Name & City to Title Case
        const toTitleCase = (str) => str.toLowerCase().replace(/(?:^|\s)\w/g, match => match.toUpperCase());
        const nameFormatted = toTitleCase(nameTrimmed);
        const cityFormatted = toTitleCase(cityTrimmed);
        if (nameTrimmed !== nameFormatted) caseFixedCount++;

        // 4. Duplicate Detection (by email or phone)
        const dedupKey = `${emailTrimmed}_${phoneClean}`;
        if (seen.has(dedupKey)) {
          duplicatesCount++;
          return; // skip duplicate!
        }
        seen.add(dedupKey);

        cleaned.push({
          name: nameFormatted,
          phone: formattedPhone,
          city: cityFormatted,
          email: emailTrimmed
        });
      });

      setCleanedData(cleaned);
      setCleaningStats({
        originalTotal: dirtyData.length,
        cleanTotal: cleaned.length,
        duplicatesRemoved: duplicatesCount,
        phoneNormalized: phoneNormalizedCount,
        caseFixed: caseFixedCount
      });
      setIsProcessing(false);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    }, 400);
  };

  const handleDownloadCleanExcel = () => {
    if (!cleanedData) return;
    const ws = XLSX.utils.json_to_sheet(cleanedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data Bersih');
    XLSX.writeFile(wb, `Data_Tersanitasi_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Modul 4 • Spreadsheet & Data Sanitizer
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">DataPolish: Auto-Sanitizer & Deduplicator</h2>
          <p className="text-sm text-slate-400">
            Perbaiki format nomor telepon Indonesia (+62), rapikan spasi liar, standarisasi huruf besar/kecil, dan buang baris duplikat dalam 1 klik.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { setDirtyData(SAMPLE_DIRTY_DATA); setCleanedData(null); setCleaningStats(null); }}
            className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-xl"
          >
            Reset Contoh
          </button>
          <button
            onClick={cleanData}
            disabled={isProcessing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-sm shadow-lg shadow-cyan-600/20 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isProcessing ? 'Membersihkan Data...' : 'Bersihkan Data Sekarang'}</span>
          </button>
        </div>
      </div>

      {/* Stats Alert */}
      {cleaningStats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 text-cyan-200 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Total Baris Awal:</span>
            <span className="text-lg font-bold text-white">{cleaningStats.originalTotal} baris</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Duplikat Dihapus:</span>
            <span className="text-lg font-bold text-rose-400">-{cleaningStats.duplicatesRemoved} duplikat</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">No. HP Distandarisasi:</span>
            <span className="text-lg font-bold text-emerald-400">{cleaningStats.phoneNormalized} kontak (+62)</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Format Teks Dirapikan:</span>
            <span className="text-lg font-bold text-cyan-300">{cleaningStats.caseFixed} entri</span>
          </div>
        </div>
      )}

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dirty Data */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              Sebelum (Data Mentah Acak-Acakan)
            </h3>
            <span className="text-[11px] text-slate-500">{dirtyData.length} baris</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[10px] text-slate-500 uppercase bg-slate-950/60">
                <tr>
                  <th className="p-2">Nama</th>
                  <th className="p-2">No. HP Mentah</th>
                  <th className="p-2">Kota</th>
                  <th className="p-2">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {dirtyData.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-800/30">
                    <td className="p-2 text-rose-300">"{r.name}"</td>
                    <td className="p-2 text-amber-300">{r.phone}</td>
                    <td className="p-2">{r.city}</td>
                    <td className="p-2 text-slate-400">{r.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Clean Data */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Sesudah (Data Bersih Siap Pakai)
            </h3>
            {cleanedData && (
              <button
                onClick={handleDownloadCleanExcel}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Excel</span>
              </button>
            )}
          </div>

          {cleanedData ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="text-[10px] text-slate-500 uppercase bg-slate-950/60">
                  <tr>
                    <th className="p-2">Nama Bersih</th>
                    <th className="p-2">WhatsApp E.164</th>
                    <th className="p-2">Kota</th>
                    <th className="p-2">Email Valid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {cleanedData.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-800/30">
                      <td className="p-2 text-emerald-300 font-semibold">{r.name}</td>
                      <td className="p-2 text-cyan-300">{r.phone}</td>
                      <td className="p-2 text-slate-200">{r.city}</td>
                      <td className="p-2 text-slate-400">{r.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500 text-xs">
              Klik tombol <strong>"Bersihkan Data Sekarang"</strong> di atas untuk memproses sanitasi otomatis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

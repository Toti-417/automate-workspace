import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { ClipboardList, Download, Copy, Sparkles, CheckCircle2, Calendar, Users, CheckSquare } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SAMPLE_MEETING_TRANSCRIPT } from '../utils/sampleData';

export default function MeetingSummaryTool() {
  const [transcript, setTranscript] = useState(SAMPLE_MEETING_TRANSCRIPT);
  const [summary, setSummary] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleExtractSummary = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Automatic extraction simulation based on regex & text parsing
      const lines = transcript.split('\n').filter(Boolean);
      
      const attendeesLine = lines.find(l => l.toLowerCase().includes('peserta') || l.toLowerCase().includes('attendees')) || 'Peserta: Tim Operasional & Manajemen';
      const agendaLine = lines.find(l => l.toLowerCase().includes('agenda')) || 'Agenda: Koordinasi dan Review Mingguan';

      // Find action items
      const actionItems = [];
      lines.forEach(line => {
        if (line.includes('Deadline') || line.startsWith('-') || line.startsWith('•') || /^\d+\./.test(line)) {
          if (line.includes(':') && (line.includes('Toti') || line.includes('Sarah') || line.includes('Kevin') || line.includes('Deploy') || line.includes('Tindakan'))) {
            actionItems.push(line.replace(/^[-•\d.]\s*/, '').trim());
          }
        }
      });

      setSummary({
        title: 'Risalah Rapat Resmi (Minutes of Meeting - MoM)',
        date: new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        attendees: attendeesLine.replace(/peserta rapat:\s*/i, ''),
        agenda: agendaLine.replace(/agenda:\s*/i, ''),
        keyPoints: [
          'Otomatisasi screening CV diperlukan untuk menangani lonjakan 300+ berkas pelamar per minggu.',
          'Penerapan AutoMate Workspace mampu memangkas waktu sortir dari 4 hari menjadi 30 detik.',
          'Pencatatan nota pengeluaran dan kuitansi operasional distandarisasi menggunakan auto-OCR.',
          'Integrasi notifikasi WhatsApp/Telegram disiapkan untuk alarm telemetri jaringan berulang.'
        ],
        actionItems: actionItems.length > 0 ? actionItems : [
          'Toti: Finalisasi alur webhook n8n untuk integrasi data rekrutmen (Deadline: Jumat)',
          'Sarah: Rilis kriteria penilaian otomatis untuk screening tahap awal (Deadline: Senin)',
          'Kevin: Standarisasi format pelaporan invoice vendor (Deadline: Rabu)'
        ]
      });

      setIsProcessing(false);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    }, 450);
  };

  const handleExportPdf = () => {
    if (!summary) return;
    const doc = new jsPDF();

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 22, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('NOTULENSI RAPAT RESMI (MINUTES OF MEETING)', 14, 15);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    doc.text(`Waktu: ${summary.date}`, 14, 32);
    doc.text(`Agenda: ${summary.agenda}`, 14, 39);
    doc.text(`Kehadiran: ${summary.attendees}`, 14, 46);

    doc.setDrawColor(226, 232, 240);
    doc.line(14, 52, 196, 52);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('POIN KESEPAKATAN UTAMA:', 14, 60);

    doc.setFont('helvetica', 'normal');
    let y = 68;
    summary.keyPoints.forEach((kp, i) => {
      doc.text(`${i + 1}. ${kp}`, 18, y);
      y += 8;
    });

    y += 4;
    doc.setFont('helvetica', 'bold');
    doc.text('TINDAKAN LANJUTAN & PENANGGUNG JAWAB (ACTION ITEMS):', 14, y);
    
    y += 8;
    doc.setFont('helvetica', 'normal');
    summary.actionItems.forEach((ai, i) => {
      doc.text(`[ ] ${ai}`, 18, y);
      y += 8;
    });

    doc.save(`MoM_AutoMate_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const handleCopyMarkdown = () => {
    if (!summary) return;
    const md = `# ${summary.title}
**Tanggal:** ${summary.date}
**Agenda:** ${summary.agenda}
**Peserta:** ${summary.attendees}

## Poin Kesepakatan Utama
${summary.keyPoints.map(kp => `- ${kp}`).join('\n')}

## Action Items (To-Do List)
${summary.actionItems.map(ai => `- [ ] ${ai}`).join('\n')}
`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
              Modul 7 • Notulensi & Manajemen Rapat
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">MeetSummary: Meeting Transcript to Actionable MoM</h2>
          <p className="text-sm text-slate-400">
            Ubah rekaman percakapan rapat atau catatan coret-coretan menjadi dokumen Minutes of Meeting (MoM) berformat eksekutif.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setTranscript(SAMPLE_MEETING_TRANSCRIPT)}
            className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-xl"
          >
            Reset Contoh
          </button>
          <button
            onClick={handleExtractSummary}
            disabled={isProcessing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs shadow-lg shadow-teal-600/20 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isProcessing ? 'Menyusun MoM...' : 'Ekstrak Risalah Rapat'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Transcript */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            Naskah Percakapan / Catatan Mentah Rapat
          </label>
          <textarea
            rows={14}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3.5 text-xs text-slate-300 font-mono leading-relaxed focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Structured MoM Output */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-teal-400" />
              Hasil Risalah Rapat Eksekutif (MoM)
            </h3>
            {summary && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyMarkdown}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px]"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Tersalin!' : 'Copy MD'}</span>
                </button>
                <button
                  onClick={handleExportPdf}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-[11px]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh PDF</span>
                </button>
              </div>
            )}
          </div>

          {summary ? (
            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                <div className="text-slate-400">📅 <strong>Waktu:</strong> {summary.date}</div>
                <div className="text-slate-400">🎯 <strong>Agenda:</strong> {summary.agenda}</div>
                <div className="text-slate-400">👥 <strong>Peserta:</strong> {summary.attendees}</div>
              </div>

              <div>
                <span className="font-bold text-white uppercase text-[11px] block mb-2">📌 Poin Kesepakatan Utama:</span>
                <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                  {summary.keyPoints.map((kp, i) => (
                    <li key={i} className="leading-relaxed">{kp}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-bold text-teal-400 uppercase text-[11px] block mb-2">⚡ Action Items & PIC:</span>
                <div className="space-y-2">
                  {summary.actionItems.map((ai, i) => (
                    <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-teal-950/20 border border-teal-800/30 text-teal-200">
                      <CheckSquare className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                      <span>{ai}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500 text-xs">
              Klik <strong>"Ekstrak Risalah Rapat"</strong> untuk melihat format notulensi instan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

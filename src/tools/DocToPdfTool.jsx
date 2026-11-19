import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { FileText, Download, Sparkles, CheckCircle2, Sliders, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DocToPdfTool() {
  const [docTitle, setDocTitle] = useState('Surat Keputusan / SOP Internal Perusahaan');
  const [author, setAuthor] = useState('Toti Putra Pratama - Operations Lead');
  const [content, setContent] = useState(`SURAT KETERANGAN RESMI & STANDAR OPERASIONAL (SOP)

1. TUJUAN DOKUMEN
Dokumen ini disusun untuk menetapkan standarisasi alur otomatisasi administrasi, rekrutmen, dan pelaporan operasional menggunakan platform AutoMate Workspace.

2. KEBIJAKAN UTAMA
a. Seluruh berkas administrasi dan formulir pengajuan wajib diproses melalui alur otomatisasi terverifikasi.
b. Dokumen yang telah dikonversi secara digital memiliki validitas yang sama dengan dokumen cetak resmi.
c. Tim operasional bertanggung jawab memantau telemetri berkas setiap 24 jam.

3. KETENTUAN TEKNIS
- Format output: Portable Document Format (PDF) standar ISO 32000-1.
- Margin: Standar dokumen korporat 20mm.
- Enkripsi dan stempel air digital disematkan pada setiap lembar dokumen.`);
  const [watermark, setWatermark] = useState('CONFIDENTIAL - AUTOMATE WORKSPACE');
  const [fontSize, setFontSize] = useState(11);
  const [isGenerating, setIsGenerating] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleGeneratePdf = () => {
    setIsGenerating(true);
    setTimeout(() => {
      try {
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        // Header decorative bar
        doc.setFillColor(37, 99, 235); // Blue primary
        doc.rect(0, 0, 210, 12, 'F');

        // Document Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(15, 23, 42);
        doc.text(docTitle, 20, 26);

        // Subtitle / Author
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text(`Disusun oleh: ${author} | Tanggal: ${new Date().toLocaleDateString('id-ID')}`, 20, 33);

        // Divider
        doc.setDrawColor(226, 232, 240);
        doc.line(20, 36, 190, 36);

        // Watermark (if enabled)
        if (watermark) {
          doc.setFontSize(26);
          doc.setTextColor(230, 235, 245);
          doc.setFont('helvetica', 'bold');
          doc.text(watermark, 105, 150, { align: 'center', angle: 45 });
        }

        // Body Content
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(fontSize);
        doc.setTextColor(30, 41, 59);

        const splitText = doc.splitTextToSize(content, 170);
        doc.text(splitText, 20, 46);

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(`Halaman 1 dari 1 | AutoMate Workspace Engine v2.0 - Powered by n8n`, 105, 285, { align: 'center' });

        doc.save(`${docTitle.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
        setSuccess(true);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      } catch (err) {
        console.error('Error creating PDF:', err);
      } finally {
        setIsGenerating(false);
      }
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Modul 1 • Dokumen & PDF
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">Smart Document & Text to PDF Converter</h2>
          <p className="text-sm text-slate-400">
            Ubah naskah, draft Word, dan laporan kerja menjadi PDF standar korporat dengan stempel air (*watermark*) otomatis dalam 1 klik.
          </p>
        </div>

        <button
          onClick={handleGeneratePdf}
          disabled={isGenerating}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg shadow-blue-600/25 transition-all disabled:opacity-50"
        >
          {isGenerating ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>{isGenerating ? 'Memproses PDF...' : 'Download PDF Resmi'}</span>
        </button>
      </div>

      {success && (
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>Dokumen PDF berhasil dibuat dan langsung diunduh ke komputer Anda!</span>
        </div>
      )}

      {/* Editor & Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Judul Dokumen
              </label>
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Penyusun / Penandatangan
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Isi Dokumen (Bisa Paste Naskah Word / Surat)
              </label>
              <textarea
                rows={12}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-4 text-white text-sm font-mono leading-relaxed focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Sidebar Configuration */}
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-5">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-400" />
              Format & Tanda Pengaman
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Watermark Latar Belakang
              </label>
              <input
                type="text"
                value={watermark}
                onChange={(e) => setWatermark(e.target.value)}
                placeholder="Misal: RAHASIA / DRAFT"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Ukuran Huruf Body: {fontSize} pt
              </label>
              <input
                type="range"
                min={9}
                max={14}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 text-xs text-blue-300/90 leading-relaxed">
              💡 <strong>Tips Awam:</strong> Hasil PDF sudah dioptimalkan untuk ukuran A4, ramah cetak mesin fotokopi, dan tidak akan pecah saat dibuka di HP/WhatsApp.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

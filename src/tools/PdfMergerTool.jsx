import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Layers, Download, Plus, Trash2, CheckCircle2, FileUp } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PdfMergerTool() {
  const [files, setFiles] = useState([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);

  const handleFileUpload = (e) => {
    const uploaded = Array.from(e.target.files);
    if (uploaded.length > 0) {
      setFiles(prev => [...prev, ...uploaded]);
    }
  };

  const handleRemove = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleMergePdfs = async () => {
    if (files.length < 2) return;
    setIsMerging(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setMergedPdfUrl(url);

      // Trigger auto-download
      const a = document.createElement('a');
      a.href = url;
      a.download = `Merged_AutoMate_${new Date().toISOString().slice(0, 10)}.pdf`;
      a.click();

      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    } catch (err) {
      console.error('Merge error:', err);
      alert('Pastikan file yang diunggah adalah dokumen PDF yang valid.');
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Modul 9 • Penggabung Dokumen
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">PDF Joiner: Multi-PDF Merger</h2>
          <p className="text-sm text-slate-400">
            Gabungkan lembar lampiran, berkas CV, sertifikat, dan nota invoice menjadi satu file PDF utuh secara instan di browser.
          </p>
        </div>

        <button
          onClick={handleMergePdfs}
          disabled={isMerging || files.length < 2}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50"
        >
          <Layers className="w-4 h-4" />
          <span>{isMerging ? 'Menggabungkan Dokumen...' : `Gabungkan (${files.length} File)`}</span>
        </button>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">
        <label className="border-2 border-dashed border-slate-700 hover:border-blue-500/60 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-950/40">
          <FileUp className="w-8 h-8 text-blue-400 mb-2" />
          <span className="text-sm font-semibold text-white">Klik atau Tarik File PDF ke Sini</span>
          <span className="text-xs text-slate-400 mt-1">Mendukung banyak file PDF sekaligus</span>
          <input
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {files.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 block">Daftar Dokumen yang Akan Digabungkan:</span>
            <div className="space-y-2">
              {files.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px]">
                      {i + 1}
                    </span>
                    <span className="font-medium text-white">{f.name}</span>
                    <span className="text-slate-500">({(f.size / 1024).toFixed(1)} KB)</span>
                  </div>
                  <button
                    onClick={() => handleRemove(i)}
                    className="text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

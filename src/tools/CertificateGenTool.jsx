import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Award, Download, Users, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CertificateGenTool() {
  const [eventTitle, setEventTitle] = useState('Pelatihan Otomasi & Telemetri Tingkat Lanjut');
  const [organizer, setOrganizer] = useState('AutoMate Workspace Academy');
  const [date, setDate] = useState('19 November 2026');
  const [recipientList, setRecipientList] = useState(
    'Toti Putra Pratama\nSarah Amelia\nBudi Santoso\nDewi Lestari\nAndi Wijaya'
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const recipients = recipientList.split('\n').map(r => r.trim()).filter(Boolean);

  const handleGenerateCertificate = (name) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Gold / Blue Elegant Border
    doc.setDrawColor(217, 119, 6); // Gold border
    doc.setLineWidth(3);
    doc.rect(10, 10, 277, 190);

    doc.setDrawColor(37, 99, 235); // Blue inner border
    doc.setLineWidth(0.8);
    doc.rect(14, 14, 269, 182);

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(30, 41, 59);
    doc.text('SERTIFIKAT PENGHARGAAN', 148.5, 45, { align: 'center' });

    doc.setFontSize(13);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('Diberikan dengan bangga dan apresiasi tertinggi kepada:', 148.5, 60, { align: 'center' });

    // Recipient Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(32);
    doc.setTextColor(37, 99, 235);
    doc.text(name, 148.5, 85, { align: 'center' });

    // Underline for name
    doc.setDrawColor(203, 213, 225);
    doc.line(70, 92, 227, 92);

    // Event & Reason
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(51, 65, 85);
    doc.text(`Atas keberhasilan dan dedikasi menyelesaikan program:`, 148.5, 108, { align: 'center' });
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42);
    doc.text(`"${eventTitle}"`, 148.5, 120, { align: 'center' });

    // Date & Signatures
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text(`Diterbitkan pada: ${date}`, 148.5, 145, { align: 'center' });

    // Signatures
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text(organizer, 148.5, 172, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text('ID Verifikasi Resmi: AUT-CERT-' + Math.random().toString(36).substring(2, 9).toUpperCase(), 148.5, 182, { align: 'center' });

    doc.save(`Sertifikat_${name.replace(/\s+/g, '_')}.pdf`);
  };

  const handleGenerateAll = () => {
    setIsGenerating(true);
    setTimeout(() => {
      recipients.forEach(name => handleGenerateCertificate(name));
      setIsGenerating(false);
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
    }, 400);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Modul 6 • HR & Event Automation
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">CertiSend: Automated Certificate Generator</h2>
          <p className="text-sm text-slate-400">
            Cetak puluhan sertifikat penghargaan resmi format PDF sekaligus hanya dari daftar nama peserta.
          </p>
        </div>

        <button
          onClick={handleGenerateAll}
          disabled={isGenerating || recipients.length === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
        >
          <Award className="w-4 h-4" />
          <span>{isGenerating ? 'Membuat Sertifikat...' : `Generate Semua (${recipients.length} Peserta)`}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white">Detail Kegiatan / Sertifikat</h3>
          
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Nama Acara / Pelatihan</label>
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Penyelenggara / Institusi</label>
            <input
              type="text"
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Tanggal Terbit</label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              Daftar Nama Penerima (1 Baris = 1 Sertifikat)
            </h3>
            <span className="text-xs text-indigo-400 font-semibold">{recipients.length} Orang Terdeteksi</span>
          </div>

          <textarea
            rows={6}
            value={recipientList}
            onChange={(e) => setRecipientList(e.target.value)}
            placeholder="Paste nama-nama penerima sertifikat disini..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3.5 text-xs text-white font-mono leading-relaxed focus:outline-none focus:border-indigo-500"
          />

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-xs text-slate-400 block mb-2">Download Individu:</span>
            <div className="flex flex-wrap gap-2">
              {recipients.map((name, i) => (
                <button
                  key={i}
                  onClick={() => handleGenerateCertificate(name)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 hover:text-white transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

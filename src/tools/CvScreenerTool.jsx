import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Users, FileSpreadsheet, Sparkles, Filter, CheckCircle2, UserCheck, Phone, Mail, Award, ArrowUpDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SAMPLE_CVS } from '../utils/sampleData';

export default function CvScreenerTool() {
  const [candidates, setCandidates] = useState(SAMPLE_CVS);
  const [jobFilter, setJobFilter] = useState('');
  const [minScore, setMinScore] = useState(70);
  const [rawCvText, setRawCvText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'add'

  const handleParseCustomCv = () => {
    if (!rawCvText.trim()) return;
    setIsProcessing(true);

    setTimeout(() => {
      // Regex extraction logic
      const emailMatch = rawCvText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      const phoneMatch = rawCvText.match(/(?:\+62|62|08)[0-9\- ]{8,14}/);
      
      const lines = rawCvText.split('\n').map(l => l.trim()).filter(Boolean);
      const guessedName = lines[0] || 'Kandidat Baru';

      // Detect skills
      const skillKeywords = ['Python', 'SQL', 'Excel', 'Power BI', 'React', 'JavaScript', 'n8n', 'Docker', 'Recruitment', 'Customer Service', 'Node.js', 'Finance', 'Telemetry', 'Regex'];
      const detectedSkills = skillKeywords.filter(k => new RegExp(`\\b${k}\\b`, 'i').test(rawCvText));

      const newCandidate = {
        name: guessedName.length < 40 ? guessedName : 'Pelamar Tanpa Nama',
        email: emailMatch ? emailMatch[0] : 'Tidak ditemukan',
        phone: phoneMatch ? phoneMatch[0] : 'Tidak ditemukan',
        role: lines[1] || 'General Applicant',
        skills: detectedSkills.length ? detectedSkills : ['General Office', 'Komunikasi'],
        experience: lines.slice(2, 4).join(' ') || 'Pengalaman kerja tertera pada CV.',
        score: Math.min(100, Math.max(65, 70 + detectedSkills.length * 5)),
        matchReason: `Terdeteksi ${detectedSkills.length} keahlian relevan.`
      };

      setCandidates(prev => [newCandidate, ...prev]);
      setRawCvText('');
      setActiveTab('list');
      setIsProcessing(false);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    }, 600);
  };

  const handleExportExcel = () => {
    const wsData = candidates.map((c, i) => ({
      No: i + 1,
      Nama_Lengkap: c.name,
      Email: c.email,
      No_WhatsApp: c.phone,
      Posisi: c.role,
      Skor_Kecocokan: `${c.score}%`,
      Daftar_Skill: c.skills.join(', '),
      Ringkasan_Pengalaman: c.experience,
      Catatan_AI: c.matchReason
    }));

    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hasil Screening HR');
    XLSX.writeFile(wb, `Screening_Kandidat_AutoMate_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const filteredCandidates = candidates.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(jobFilter.toLowerCase()) || 
                        c.role.toLowerCase().includes(jobFilter.toLowerCase()) ||
                        c.skills.some(s => s.toLowerCase().includes(jobFilter.toLowerCase()));
    const matchScore = c.score >= minScore;
    return matchSearch && matchScore;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Modul 2 • HR & Rekrutmen
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">TalentScan: AI & Regex CV Screener</h2>
          <p className="text-sm text-slate-400">
            Ekstrak data kontak pelamar (WhatsApp & Email), deteksi keahlian kunci, dan beri skor kecocokan dalam sekejap tanpa baca manual berjam-jam.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCandidates(SAMPLE_CVS)}
            className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-all"
          >
            Reset Sample Data
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm shadow-lg shadow-emerald-600/20 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export ke Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Tabs & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'list'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Daftar Kandidat Ter-Ranking ({filteredCandidates.length})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'add'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            + Scan CV Baru (Paste Text)
          </button>
        </div>

        {activeTab === 'list' && (
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Cari nama, role, skill..."
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500 w-48"
            />
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Min Skor:</span>
              <select
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="bg-slate-950 border border-slate-700/80 rounded-lg px-2 py-1 text-white text-xs focus:outline-none"
              >
                <option value={0}>Semua (0%)</option>
                <option value={70}>Lolos Tahap 1 (70%+)</option>
                <option value={85}>Kandidat Unggulan (85%+)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Main Content View */}
      {activeTab === 'add' ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Paste Teks CV / Resume Pelamar Kerja
          </h3>
          <p className="text-xs text-slate-400">
            Copy seluruh isi CV dari PDF atau Word, lalu paste di bawah. Engine otomatis membaca nomor telepon, email, keahlian, dan ringkasan kerja.
          </p>
          <textarea
            rows={10}
            value={rawCvText}
            onChange={(e) => setRawCvText(e.target.value)}
            placeholder="Contoh:
Budi Santoso
Senior Data Analyst
budi.santoso@email.com | 081234567890
Pengalaman: 3 tahun menganalisa data transaksi dan membuat dashboard Power BI.
Skill: SQL, Python, Power BI, Excel, Business Intelligence."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-4 text-white text-xs font-mono focus:outline-none focus:border-purple-500 leading-relaxed"
          />
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setActiveTab('list')}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Batal
            </button>
            <button
              onClick={handleParseCustomCv}
              disabled={isProcessing || !rawCvText.trim()}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
            >
              {isProcessing ? 'Mengekstrak Data...' : 'Mulai Ekstraksi AI & Regex'}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredCandidates.map((c, idx) => (
            <div
              key={idx}
              className="bg-slate-900/60 border border-slate-800/80 hover:border-purple-500/40 rounded-2xl p-5 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-bold text-white">{c.name}</h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {c.role}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-purple-400" />
                      {c.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      {c.phone}
                    </span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-1">
                  <span className="text-xs text-slate-400">Match Score:</span>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold text-sm">
                    <Award className="w-4 h-4 text-purple-400" />
                    <span>{c.score}%</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300">
                <span className="font-semibold text-slate-400 block mb-1">Ringkasan Pengalaman:</span>
                {c.experience}
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-xs text-slate-500 mr-2">Skills Terdeteksi:</span>
                {c.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-2 py-0.5 rounded-md bg-purple-950/50 text-purple-300 border border-purple-800/50 text-[11px]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {filteredCandidates.length === 0 && (
            <div className="text-center py-12 bg-slate-900/40 border border-slate-800 rounded-2xl">
              <p className="text-sm text-slate-400">Tidak ada kandidat yang cocok dengan kriteria filter saat ini.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

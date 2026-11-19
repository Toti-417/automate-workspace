import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { DollarSign, CheckCircle2, Clock, XCircle, FileSpreadsheet, Plus, Trash2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ReimbursementTool() {
  const [claims, setClaims] = useState([
    { id: 1, employee: 'Toti Putra Pratama', category: 'Transport Lapangan (BBM/Tol)', amount: 250000, date: '2026-11-17', status: 'Approved', note: 'Survey BTS Site Tangerang Selatan' },
    { id: 2, employee: 'Dimas Kurniawan', category: 'Konsumsi Lembur Proyek', amount: 120000, date: '2026-11-18', status: 'Pending', note: 'Maintenance Core Switch Nocturnal' },
    { id: 3, employee: 'Sarah Amelia', category: 'Software Subscription (n8n Cloud)', amount: 350000, date: '2026-11-18', status: 'Approved', note: 'Alur Otomasi Rekrutmen Q4' },
    { id: 4, employee: 'Budi Santoso', category: 'Kabel UTP & Konektor RJ45', amount: 85000, date: '2026-11-19', status: 'Pending', note: 'Penggantian Patch Cord Rusak' }
  ]);

  const [newEmployee, setNewEmployee] = useState('');
  const [newCategory, setNewCategory] = useState('Transport Lapangan (BBM/Tol)');
  const [newAmount, setNewAmount] = useState('');
  const [newNote, setNewNote] = useState('');

  const formatRupiah = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  const totalAmount = claims.reduce((sum, c) => sum + c.amount, 0);
  const approvedAmount = claims.filter(c => c.status === 'Approved').reduce((sum, c) => sum + c.amount, 0);
  const pendingAmount = claims.filter(c => c.status === 'Pending').reduce((sum, c) => sum + c.amount, 0);

  const handleAddClaim = () => {
    if (!newEmployee.trim() || !newAmount) return;
    setClaims([
      ...claims,
      {
        id: Date.now(),
        employee: newEmployee,
        category: newCategory,
        amount: Number(newAmount),
        date: new Date().toISOString().slice(0, 10),
        status: 'Pending',
        note: newNote || 'Klaim operasional'
      }
    ]);
    setNewEmployee('');
    setNewAmount('');
    setNewNote('');
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
  };

  const handleToggleStatus = (id) => {
    setClaims(claims.map(c => {
      if (c.id === id) {
        return { ...c, status: c.status === 'Approved' ? 'Pending' : 'Approved' };
      }
      return c;
    }));
  };

  const handleRemove = (id) => {
    setClaims(claims.filter(c => c.id !== id));
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(claims.map((c, i) => ({
      No: i + 1,
      Karyawan: c.employee,
      Kategori: c.category,
      Nominal: c.amount,
      Tanggal: c.date,
      Status: c.status,
      Keterangan: c.note
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Rekap Reimbursement');
    XLSX.writeFile(wb, `Reimbursement_Rekap_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Modul 10 • Klaim Operasional & Approval
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">ExpensifyLite: Reimbursement & Expense Tracker</h2>
          <p className="text-sm text-slate-400">
            Rekap pengajuan nota kasbon, BBM, dan pembelian sparepart teknisi lapangan dengan alur verifikasi approval instan.
          </p>
        </div>

        <button
          onClick={handleExportExcel}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-lg shadow-emerald-600/20 transition-all"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Rekap Excel</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 block">Total Pengajuan</span>
          <span className="text-xl font-bold text-white">{formatRupiah(totalAmount)}</span>
        </div>
        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40">
          <span className="text-xs text-emerald-300 block">Disetujui (Approved)</span>
          <span className="text-xl font-bold text-emerald-400">{formatRupiah(approvedAmount)}</span>
        </div>
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40">
          <span className="text-xs text-amber-300 block">Menunggu Verifikasi</span>
          <span className="text-xl font-bold text-amber-400">{formatRupiah(pendingAmount)}</span>
        </div>
      </div>

      {/* Add New Claim Form */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Form Pengajuan Cepat</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Nama Karyawan..."
            value={newEmployee}
            onChange={(e) => setNewEmployee(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
          >
            <option>Transport Lapangan (BBM/Tol)</option>
            <option>Konsumsi Lembur Proyek</option>
            <option>Software Subscription (n8n Cloud)</option>
            <option>Perlengkapan Alat Kerja (Hardware)</option>
          </select>
          <input
            type="number"
            placeholder="Nominal (Rp)..."
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
          />
          <button
            onClick={handleAddClaim}
            disabled={!newEmployee.trim() || !newAmount}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs disabled:opacity-40"
          >
            <Plus className="w-4 h-4" />
            <span>Kirim Pengajuan</span>
          </button>
        </div>
      </div>

      {/* Claims List Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Karyawan</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Nominal (Rp)</th>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Keterangan</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {claims.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/30">
                  <td className="p-3 font-semibold text-white">{c.employee}</td>
                  <td className="p-3">{c.category}</td>
                  <td className="p-3 font-mono text-emerald-400 font-semibold">{formatRupiah(c.amount)}</td>
                  <td className="p-3 text-slate-400">{c.date}</td>
                  <td className="p-3 text-slate-400">{c.note}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleToggleStatus(c.id)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all ${
                        c.status === 'Approved'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {c.status === 'Approved' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      <span>{c.status}</span>
                    </button>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleRemove(c.id)}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

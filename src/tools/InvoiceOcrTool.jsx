import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Receipt, FileSpreadsheet, Download, Plus, Trash2, Calculator, CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SAMPLE_INVOICE_ITEMS } from '../utils/sampleData';

export default function InvoiceOcrTool() {
  const [vendorName, setVendorName] = useState('PT Telekomunikasi Selular Solusi');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2026-X098');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [items, setItems] = useState(SAMPLE_INVOICE_ITEMS);
  const [taxRate, setTaxRate] = useState(11); // 11% PPN Indonesia

  const subtotal = items.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const grandTotal = subtotal + taxAmount;

  const handleAddItem = () => {
    setItems([
      ...items,
      { item: 'Item Pengadaan Baru', qty: 1, unitPrice: 100000, category: 'Operasional' }
    ]);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = field === 'qty' || field === 'unitPrice' ? Number(value) : value;
    setItems(updated);
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
  };

  const handleExportExcel = () => {
    const wsData = items.map((it, idx) => ({
      No: idx + 1,
      Deskripsi_Barang_Jasa: it.item,
      Kategori: it.category,
      Kuantitas: it.qty,
      Harga_Satuan: it.unitPrice,
      Subtotal: it.qty * it.unitPrice
    }));

    // Add summary rows
    wsData.push({});
    wsData.push({ Deskripsi_Barang_Jasa: 'SUBTOTAL', Subtotal: subtotal });
    wsData.push({ Deskripsi_Barang_Jasa: `PAJAK (PPN ${taxRate}%)`, Subtotal: taxAmount });
    wsData.push({ Deskripsi_Barang_Jasa: 'GRAND TOTAL', Subtotal: grandTotal });

    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Rincian Invoice');
    XLSX.writeFile(wb, `${invoiceNumber}_Rekap_Keuangan.xlsx`);
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
  };

  const handleExportPdf = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, 210, 25, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('INVOICE / REKAP PENGELUARAN RESMI', 14, 16);

    // Vendor Info
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`Vendor / Perusahaan: ${vendorName}`, 14, 35);
    doc.text(`Nomor Invoice: ${invoiceNumber}`, 14, 42);
    doc.text(`Tanggal: ${invoiceDate}`, 14, 49);

    // Table
    const tableData = items.map((it, i) => [
      i + 1,
      it.item,
      it.category,
      it.qty,
      formatRupiah(it.unitPrice),
      formatRupiah(it.qty * it.unitPrice)
    ]);

    doc.autoTable({
      startY: 55,
      head: [['No', 'Deskripsi Item', 'Kategori', 'Qty', 'Harga Satuan', 'Subtotal']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255] }
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Subtotal: ${formatRupiah(subtotal)}`, 140, finalY);
    doc.text(`PPN (${taxRate}%): ${formatRupiah(taxAmount)}`, 140, finalY + 7);
    doc.setFont('helvetica', 'bold');
    doc.text(`Grand Total: ${formatRupiah(grandTotal)}`, 140, finalY + 15);

    doc.save(`${invoiceNumber}_Invoice.pdf`);
    confetti({ particleCount: 45, spread: 50, origin: { y: 0.8 } });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Modul 3 • Keuangan & Pembukuan
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">BillToSheet: Invoice & Receipt Auto-OCR</h2>
          <p className="text-sm text-slate-400">
            Ekstrak nota pengadaan, rincian biaya proyek, dan hitung pajak PPN secara otomatis ke format Excel dan PDF siap audit.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportPdf}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-all"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Unduh PDF</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-lg shadow-emerald-600/20 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export ke Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Meta Information */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Nama Vendor / Toko</label>
          <input
            type="text"
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Nomor Invoice / Kuitansi</label>
          <input
            type="text"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Tanggal Transaksi</label>
          <input
            type="date"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-400" />
            Daftar Item Pengeluaran
          </h3>
          <button
            onClick={handleAddItem}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 text-xs font-medium transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Item</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Item Deskripsi</th>
                <th className="p-3">Kategori</th>
                <th className="p-3 w-20">Qty</th>
                <th className="p-3">Harga Satuan (Rp)</th>
                <th className="p-3">Subtotal</th>
                <th className="p-3 w-12 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {items.map((it, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="p-3">
                    <input
                      type="text"
                      value={it.item}
                      onChange={(e) => handleItemChange(idx, 'item', e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-700/60 rounded-lg px-2.5 py-1 text-white text-xs focus:outline-none"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="text"
                      value={it.category}
                      onChange={(e) => handleItemChange(idx, 'category', e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-700/60 rounded-lg px-2.5 py-1 text-white text-xs focus:outline-none"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      min={1}
                      value={it.qty}
                      onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-700/60 rounded-lg px-2 py-1 text-white text-xs focus:outline-none text-center"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      step={1000}
                      value={it.unitPrice}
                      onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-700/60 rounded-lg px-2.5 py-1 text-white text-xs focus:outline-none"
                    />
                  </td>
                  <td className="p-3 font-semibold text-emerald-400">
                    {formatRupiah(it.qty * it.unitPrice)}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleRemoveItem(idx)}
                      disabled={items.length <= 1}
                      className="text-slate-500 hover:text-rose-400 disabled:opacity-30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculation Summary Card */}
        <div className="p-5 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-end justify-end gap-6 text-xs">
          <div className="space-y-2 w-full sm:w-72">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal:</span>
              <span className="font-semibold text-white">{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-400 items-center">
              <span>Pajak PPN:</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-12 bg-slate-900 border border-slate-700 rounded px-1 text-center text-white"
                />
                <span>% = {formatRupiah(taxAmount)}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-emerald-400">
              <span>Total Tagihan:</span>
              <span>{formatRupiah(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

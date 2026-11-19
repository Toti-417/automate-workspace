// Sample datasets for 1-click testing by recruiters & non-tech users

export const SAMPLE_CVS = [
  {
    name: "Toti Putra Pratama",
    email: "totiputra08@gmail.com",
    phone: "+62 822-8643-9840",
    role: "Senior Data & Automation Specialist",
    skills: ["Python", "n8n", "SQL", "Power BI", "Regex Telemetry", "Docker", "Process Automation"],
    experience: "4+ years at Telkomsel / Huawei Managed Service, automated 15,000+ network incident reports.",
    score: 98,
    matchReason: "Direct match for high-volume telemetry automation, SQL analytics, and pipeline engineering."
  },
  {
    name: "Rizky Firmansyah",
    email: "rizky.firman@gmail.com",
    phone: "+62 813-9988-7711",
    role: "Junior Web Developer",
    skills: ["HTML/CSS", "JavaScript", "React", "Git"],
    experience: "1 year internship building landing pages and internal admin forms.",
    score: 72,
    matchReason: "Good front-end fundamentals, needs guidance on backend database pipelines."
  },
  {
    name: "Dewi Anggraini",
    email: "dewi.anggraini@yahoo.co.id",
    phone: "+62 857-1234-5678",
    role: "HR Generalist & Talent Acquisition",
    skills: ["Recruitment", "Onboarding", "Payroll Basics", "LinkedIn Talent", "SOP Drafting"],
    experience: "3 years screening 500+ candidates monthly, managing interview schedules and HR reports.",
    score: 85,
    matchReason: "Strong communication and high-volume applicant screening experience."
  }
];

export const SAMPLE_INVOICE_ITEMS = [
  { item: "Server Rack Hosting & Colocation (Tier-3)", qty: 2, unitPrice: 3500000, category: "Infrastructure" },
  { item: "Fiber Optic Patch Cord SC-LC 10m", qty: 25, unitPrice: 45000, category: "Hardware" },
  { item: "Cisco SFP+ 10G Transceiver Module", qty: 8, unitPrice: 650000, category: "Network Equipment" },
  { item: "Cloud Backup Storage 2TB Monthly", qty: 1, unitPrice: 480000, category: "Cloud Services" },
  { item: "Technician Site Survey & OTDR Testing", qty: 3, unitPrice: 1200000, category: "Professional Services" }
];

export const SAMPLE_DIRTY_DATA = [
  { name: "budi santoso  ", phone: "08123456789", city: "jakarta selatan", email: "Budi.S@GMAIL.COM  " },
  { name: "Siti Rahmawati", phone: "+628123456789", city: "JAKARTA", email: "siti.rahma@gmail.com" }, // Duplicate phone!
  { name: "ANDI WIJAYA", phone: "62-811-2233-44", city: "Bandung ", email: "andi_w@yahoo.com" },
  { name: "budi santoso", phone: "0812-3456-7890", city: "Jakarta Selatan", email: "budi.s@gmail.com" },
  { name: "Rina Kartika   ", phone: "085712341234", city: "surabaya", email: "rina.k@outlook.com" },
  { name: "Eko Prasetyo", phone: "089699887766", city: "semarang", email: "eko.p@gmail.com" },
  { name: "budi santoso  ", phone: "08123456789", city: "jakarta selatan", email: "budi.s@gmail.com" } // Exact duplicate
];

export const SAMPLE_TELCO_LOGS = `2026-11-19 08:14:22 [WARNING] CELL_ID=TSL_JKT_0421 ALARM_CODE=ALM-OPT-8891 RSRP=-114.2dBm SINR=1.4dB STATUS=DEGRADED VENDOR=HUAWEI
2026-11-19 08:15:01 [CRITICAL] CELL_ID=TSL_BDG_1084 ALARM_CODE=ALM-PWR-0012 VSWR=2.85 STATUS=OUTAGE VENDOR=HUAWEI
2026-11-19 08:15:44 [INFO] CELL_ID=TSL_SBY_0911 ALARM_CODE=ALM-REC-0001 RSRP=-88.5dBm SINR=18.6dB STATUS=NORMAL VENDOR=ERICSSON
2026-11-19 08:16:10 [CRITICAL] CELL_ID=TSL_JKT_0421 ALARM_CODE=ALM-LINK-4040 FIBER_LOSS=14.8dB STATUS=DOWN VENDOR=HUAWEI
2026-11-19 08:17:33 [WARNING] CELL_ID=TSL_SMG_0045 ALARM_CODE=ALM-OPT-8891 RSRP=-109.8dBm SINR=3.2dB STATUS=DEGRADED VENDOR=ZTE`;

export const SAMPLE_MEETING_TRANSCRIPT = `Peserta Rapat: Toti (Lead Automation), Sarah (HR Head), Kevin (Finance), Dimas (Operations)
Agenda: Evaluasi Otomasi Rekrutmen & Efisiensi Pengeluaran Q4

Poin Diskusi:
1. Sarah menyampaikan bahwa tim HR saat ini menerima lebih dari 300 CV per minggu untuk posisi engineer dan butuh 4 hari hanya untuk sortir manual. Diperlukan parser otomatis yang bisa langsung mengekstrak nomor WhatsApp dan skill set.
2. Toti mendemonstrasikan sistem AutoMate Workspace yang bisa membaca 100 CV dalam 30 detik menggunakan n8n webhook dan regex.
3. Kevin menyoroti masalah reimbursement struk operasional lapangan yang sering hilang atau kuitansi manual yang tidak terbaca. Disepakati untuk membuat portal upload foto struk dengan auto-OCR ke Google Sheets.
4. Dimas meminta penambahan notifikasi WhatsApp otomatis kepada teknisi jika terjadi alarm telemetri BTS berulang lebih dari 3 kali.

Tindakan Lanjutan (Action Items):
- Toti: Deploy webhook n8n di server lokal dan integrasikan dengan spreadsheet tim HR (Deadline: Jumat ini).
- Sarah: Buat kriteria standar penilaian skill untuk screening otomatis (Deadline: Senin depan).
- Kevin: Tentukan format template spreadsheet laporan keuangan mingguan (Deadline: Rabu).`;

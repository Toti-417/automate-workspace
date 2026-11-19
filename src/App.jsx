import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DocToPdfTool from './tools/DocToPdfTool';
import PdfMergerTool from './tools/PdfMergerTool';
import CvScreenerTool from './tools/CvScreenerTool';
import CertificateGenTool from './tools/CertificateGenTool';
import InvoiceOcrTool from './tools/InvoiceOcrTool';
import ReimbursementTool from './tools/ReimbursementTool';
import DataCleanerTool from './tools/DataCleanerTool';
import TelemetryParserTool from './tools/TelemetryParserTool';
import MeetingSummaryTool from './tools/MeetingSummaryTool';
import WebhookNotifierTool from './tools/WebhookNotifierTool';
import N8nLibraryModal from './tools/N8nLibraryModal';

export default function App() {
  const [activeTool, setActiveTool] = useState('doc-pdf');

  const renderActiveTool = () => {
    switch (activeTool) {
      case 'doc-pdf':
        return <DocToPdfTool />;
      case 'pdf-merger':
        return <PdfMergerTool />;
      case 'cv-screener':
        return <CvScreenerTool />;
      case 'certificate-gen':
        return <CertificateGenTool />;
      case 'invoice-ocr':
        return <InvoiceOcrTool />;
      case 'reimbursement':
        return <ReimbursementTool />;
      case 'data-cleaner':
        return <DataCleanerTool />;
      case 'telemetry':
        return <TelemetryParserTool />;
      case 'meeting-summary':
        return <MeetingSummaryTool />;
      case 'webhook-notifier':
        return <WebhookNotifierTool />;
      case 'n8n-library':
        return <N8nLibraryModal />;
      default:
        return <DocToPdfTool />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeTool={activeTool} setActiveTool={setActiveTool} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-950/40">
          <div className="max-w-6xl mx-auto">
            {renderActiveTool()}
          </div>
        </main>
      </div>
    </div>
  );
}

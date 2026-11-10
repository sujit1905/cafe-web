import React, { useState } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import {
  QrCode,
  Download,
  Copy,
  ExternalLink,
  Eye,
  Coffee,
  Printer,
} from 'lucide-react';
import { toast } from 'sonner';
import QRCodeModal from '../../components/QRCodeModal.jsx';

export default function AdminQRPage() {
  const [selectedTable, setSelectedTable] = useState('T01');
  const [customTable, setCustomTable] = useState('');
  const [modalTable, setModalTable] = useState(null);

  // Quick preset tables T01 to T12
  const presetTables = Array.from({ length: 12 }, (_, i) => {
    const num = i + 1;
    return `T${num < 10 ? '0' + num : num}`;
  });

  const activeTable = customTable.trim() || selectedTable;
  const currentOrigin = window.location.origin;
  const qrUrl = `${currentOrigin}/menu?table=${encodeURIComponent(activeTable)}`;

  const handleDownloadPNG = (tableId) => {
    try {
      const canvas = document.getElementById(`qr-admin-canvas-${tableId}`);
      if (!canvas) {
        toast.error('Could not render image for download');
        return;
      }
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `table-${tableId}-qr.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      toast.success(`Downloaded QR Code for Table ${tableId}`);
    } catch (err) {
      console.error('Download failed:', err);
      toast.error('Failed to download image');
    }
  };

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('Table ordering URL copied to clipboard');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-espresso">
          Table QR Code Generator
        </h1>
        <p className="text-xs text-latte mt-1">
          Generate contactless digital menus with instant table recognition.
        </p>
      </div>

      {/* Main Generator Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Configuration Form */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-border">
            <div className="p-2 rounded-xl bg-ivory text-terracotta">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-espresso">
                Select or Enter Table
              </h2>
              <p className="text-xs text-latte">
                Choose a predefined station or define a custom seating area.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-latte mb-2">
                Standard Dining Tables
              </label>
              <select
                value={selectedTable}
                onChange={(e) => {
                  setSelectedTable(e.target.value);
                  setCustomTable('');
                }}
                className="w-full px-4 py-2.5 bg-ivory/40 border border-border rounded-xl text-sm font-semibold text-espresso focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta cursor-pointer"
              >
                {Array.from({ length: 20 }, (_, i) => {
                  const num = i + 1;
                  const val = `T${num < 10 ? '0' + num : num}`;
                  return (
                    <option key={val} value={val}>
                      Table {val}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-border w-full" />
              <span className="bg-white px-3 text-[11px] font-semibold uppercase tracking-wider text-latte">
                Or Custom Table / Lounge
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-latte mb-1.5">
                Custom Table Identifier
              </label>
              <input
                type="text"
                value={customTable}
                onChange={(e) => setCustomTable(e.target.value)}
                placeholder="e.g. Patio-03, Bar-01, Rooftop-A"
                className="w-full px-4 py-2.5 bg-ivory/40 border border-border rounded-xl text-sm text-espresso placeholder-latte focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta"
              />
            </div>

            {/* Target URL Info */}
            <div className="p-3.5 bg-ivory rounded-xl border border-border text-xs space-y-1">
              <span className="font-semibold text-espresso block">Target URL:</span>
              <p className="font-mono text-latte text-[11px] break-all">{qrUrl}</p>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleDownloadPNG(activeTable)}
                className="flex-1 py-3 px-4 bg-terracotta hover:bg-terracotta-dark text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
              >
                <Download className="w-4 h-4" />
                <span>Download High-Res PNG</span>
              </button>

              <button
                onClick={() => handleCopyLink(qrUrl)}
                className="py-3 px-4 bg-white hover:bg-ivory border border-border text-espresso rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Copy className="w-4 h-4 text-latte" />
                <span>Copy Link</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Live Standee / Card Preview */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full max-w-sm bg-white rounded-3xl p-8 border border-border shadow-xl text-center space-y-4">
            {/* Standee Branding */}
            <div className="flex items-center justify-center gap-2 text-espresso">
              <div className="w-7 h-7 rounded-lg bg-espresso text-ivory flex items-center justify-center">
                <Coffee className="w-4 h-4" />
              </div>
              <span className="font-serif text-lg font-bold">Brew &amp; Bite</span>
            </div>

            <p className="text-xs text-latte">
              Scan with your phone camera to browse the menu and order directly to your seat.
            </p>

            {/* Center QR Preview */}
            <div className="p-6 bg-ivory rounded-2xl border border-border inline-block shadow-inner">
              <QRCodeSVG
                value={qrUrl}
                size={220}
                level="H"
                includeMargin={true}
                className="mx-auto"
              />
            </div>

            <div className="pt-2">
              <span className="text-xs uppercase tracking-widest text-latte font-semibold block">
                Table
              </span>
              <span className="font-serif text-3xl font-bold text-terracotta">
                {activeTable}
              </span>
            </div>

            {/* Hidden canvas for download */}
            <div className="hidden">
              <QRCodeCanvas
                id={`qr-admin-canvas-${activeTable}`}
                value={qrUrl}
                size={600}
                level="H"
                includeMargin={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick-Generate Grid for T01 - T12 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-sm space-y-6">
        <div>
          <h2 className="font-serif text-xl font-bold text-espresso">
            Quick Table Directory (T01 – T12)
          </h2>
          <p className="text-xs text-latte mt-1">
            Download individual QR code badges for quick cafe setup.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {presetTables.map((tId) => {
            const tableUrl = `${currentOrigin}/menu?table=${tId}`;
            return (
              <div
                key={tId}
                className="bg-ivory/60 hover:bg-ivory border border-border rounded-2xl p-4 flex flex-col items-center text-center transition-all group"
              >
                <span className="font-serif font-bold text-espresso text-base mb-2">
                  Table {tId}
                </span>

                <div className="p-2 bg-white rounded-xl border border-border mb-3 group-hover:scale-105 transition-transform">
                  <QRCodeSVG value={tableUrl} size={90} level="M" />
                </div>

                {/* Hidden canvas for quick preset download */}
                <div className="hidden">
                  <QRCodeCanvas
                    id={`qr-admin-canvas-${tId}`}
                    value={tableUrl}
                    size={512}
                    level="H"
                    includeMargin={true}
                  />
                </div>

                <div className="flex items-center gap-1.5 mt-auto w-full pt-2">
                  <button
                    onClick={() => setModalTable(tId)}
                    className="flex-1 py-1.5 px-2 bg-white hover:bg-espresso hover:text-white border border-border text-espresso rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                    title="Preview QR Code"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View</span>
                  </button>

                  <button
                    onClick={() => handleDownloadPNG(tId)}
                    className="p-1.5 bg-terracotta hover:bg-terracotta-dark text-white rounded-lg transition-colors"
                    title={`Download PNG for Table ${tId}`}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Large Preview / Modal */}
      <QRCodeModal
        isOpen={Boolean(modalTable)}
        onClose={() => setModalTable(null)}
        tableNumber={modalTable}
      />
    </div>
  );
}

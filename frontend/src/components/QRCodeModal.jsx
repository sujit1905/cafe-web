import React, { useEffect, useRef } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { X, Download, Copy, ExternalLink, Coffee } from 'lucide-react';
import { toast } from 'sonner';

export default function QRCodeModal({ isOpen, onClose, tableNumber }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentOrigin = window.location.origin;
  const qrUrl = `${currentOrigin}/menu?table=${encodeURIComponent(tableNumber || '1')}`;

  const handleDownload = () => {
    try {
      const canvas = document.getElementById(`qr-canvas-${tableNumber}`);
      if (!canvas) {
        toast.error('Could not generate downloadable image');
        return;
      }
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `table-${tableNumber || 'custom'}-qr.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      toast.success(`Downloaded QR Code for Table ${tableNumber}`);
    } catch (err) {
      console.error('Download error:', err);
      toast.error('Failed to download QR code');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrUrl);
    toast.success('Ordering link copied to clipboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-espresso/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-border z-10 text-center animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-latte hover:text-espresso p-1.5 rounded-full hover:bg-ivory transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cafe Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ivory text-espresso text-xs font-semibold mb-3 border border-border">
          <Coffee className="w-3.5 h-3.5 text-terracotta" />
          <span>Brew &amp; Bite Cafe</span>
        </div>

        <h3 className="text-xl font-serif font-bold text-espresso">
          Table {tableNumber || '1'} QR Code
        </h3>
        <p className="text-xs text-latte mt-1">
          Guests can scan this code to browse the menu and order directly to this table.
        </p>

        {/* QR Code Container */}
        <div className="my-6 p-6 bg-ivory rounded-2xl border border-border inline-block shadow-inner">
          <QRCodeSVG
            value={qrUrl}
            size={200}
            level="H"
            includeMargin={true}
            className="mx-auto"
          />
          {/* Hidden Canvas used for high-res PNG download */}
          <div className="hidden">
            <QRCodeCanvas
              id={`qr-canvas-${tableNumber}`}
              value={qrUrl}
              size={512}
              level="H"
              includeMargin={true}
            />
          </div>
          <p className="mt-3 text-[11px] font-mono text-latte truncate max-w-[200px] mx-auto">
            {qrUrl}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={handleDownload}
            className="w-full py-2.5 px-4 bg-terracotta hover:bg-terracotta-dark text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleCopyLink}
              className="flex-1 py-2 px-3 border border-border rounded-xl text-xs font-medium text-espresso hover:bg-ivory transition-colors flex items-center justify-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5 text-latte" />
              <span>Copy Link</span>
            </button>

            <a
              href={qrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 px-3 border border-border rounded-xl text-xs font-medium text-espresso hover:bg-ivory transition-colors flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-latte" />
              <span>Test Menu</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

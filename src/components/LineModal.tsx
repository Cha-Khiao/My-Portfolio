'use client';

import * as React from 'react';
import { X, Copy, Check, ExternalLink } from 'lucide-react';
import { LineIcon } from './icons/LineIcon';

interface LineModalProps {
  isOpen: boolean;
  onClose: () => void;
  lineId?: string;
  lineUrl: string;
  lineQrUrl?: string;
}

export function LineModal({ isOpen, onClose, lineId, lineUrl, lineQrUrl }: LineModalProps) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const targetLineUrl = lineUrl || (lineId ? `https://line.me/ti/p/~${lineId}` : 'https://line.me/ti/p/swWxGS9q9y');
  const qrImageSrc = lineQrUrl || '/images/line-qr.jpg';

  const handleCopy = () => {
    const textToCopy = targetLineUrl;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl bg-card border border-border p-6 shadow-2xl transition-all transform scale-100 flex flex-col items-center text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="btn-close-modal absolute top-4 right-4 w-8 h-8"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* LINE Badge */}
        <div className="w-12 h-12 rounded-2xl bg-[#06C755] flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 mb-3">
          <LineIcon className="w-7 h-7" />
        </div>

        <h3 className="font-outfit text-xl font-bold text-foreground">
          ติดต่อผ่าน LINE
        </h3>
        <p className="text-xs text-fg-secondary mt-1 mb-5">
          สแกน QR Code หรือกดเปิดลิงก์เพื่อเพิ่มเพื่อนได้ทันที
        </p>

        {/* QR Code Frame */}
        <div className="p-3.5 rounded-xl bg-white border border-border shadow-inner mb-4">
          <img
            src={qrImageSrc}
            alt="LINE QR Code"
            className="w-48 h-48 rounded-lg object-contain"
          />
        </div>

        {/* LINE Link Copy Box */}
        <div className="w-full flex items-center justify-between gap-2 p-2.5 rounded-xl bg-tag-bg border border-border mb-4">
          <div className="text-left pl-1 min-w-0 flex-1">
            <div className="text-[10px] uppercase font-semibold text-fg-tertiary">LINE Link</div>
            <div className="text-xs font-medium text-foreground truncate">{targetLineUrl}</div>
          </div>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-medium text-foreground hover:border-border-hover transition-all flex items-center gap-1 shadow-sm active:scale-95 flex-shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" /> คัดลอกแล้ว
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-fg-tertiary" /> คัดลอกลิงก์
              </>
            )}
          </button>
        </div>

        {/* Open LINE Button */}
        <a
          href={targetLineUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-line w-full py-2.5 text-sm gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98]"
        >
          <ExternalLink className="w-4 h-4" /> เปิดในแอปพลิเคชัน LINE
        </a>
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { CertificateData } from '@/lib/initial-data';

interface CertificateModalProps {
  cert: CertificateData | null;
  onClose: () => void;
}

export function CertificateModal({ cert, onClose }: CertificateModalProps) {
  const [imgError, setImgError] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  React.useEffect(() => {
    setImgError(false);
    setIsReady(false);
    const timer = setTimeout(() => setIsReady(true), 80);
    return () => clearTimeout(timer);
  }, [cert]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (cert) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [cert, onClose]);

  if (!cert) return null;

  const isPdf = cert.imageUrl ? (
    cert.imageUrl.toLowerCase().endsWith('.pdf') ||
    cert.imageUrl.includes('.pdf') ||
    cert.imageUrl.startsWith('data:application/pdf')
  ) : false;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-zoom-out"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-4xl my-auto flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="btn-close-modal absolute -top-3 -right-2 sm:-top-3.5 sm:-right-3.5 z-30 w-8 h-8 sm:w-9 sm:h-9 shadow-xl"
          aria-label="Close"
          title="ปิด"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Card */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-3.5 sm:px-5 py-2.5 sm:py-3 border-b border-border bg-tag-bg/80 flex-shrink-0">
            <div className="min-w-0 pr-3">
              <h3 className="font-outfit text-xs sm:text-sm md:text-base font-bold text-foreground truncate">
                {cert.name}
              </h3>
              <p className="text-[11px] sm:text-xs text-fg-secondary mt-0.5 flex items-center gap-1.5 sm:gap-2">
                <span className="font-semibold" style={{ color: cert.color || '#4F46E5' }}>{cert.org}</span>
                {isPdf && (
                  <span className="text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-500 font-mono font-bold">
                    PDF Document
                  </span>
                )}
              </p>
            </div>
            {cert.imageUrl && (
              <a
                href={cert.imageUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-primary px-3.5 sm:px-5 py-1.5 text-xs sm:text-sm gap-1.5 shadow-sm flex-shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" /> <span className="hidden xs:inline sm:inline">เปิดดู</span>เต็มจอ
              </a>
            )}
          </div>

          {/* Main Viewer Area - Desktop Native PDF / Mobile Instant Real Image View */}
          <div className="p-1 sm:p-2 flex flex-col items-center justify-center bg-card">
            {isPdf ? (
              <div className="relative w-full h-[62vh] sm:h-[68vh] md:h-[72vh] flex items-center justify-center rounded-sm overflow-hidden border border-border bg-white shadow-inner">
                {isMobile ? (
                  <img
                    src={`/api/certificates/thumbnail?url=${encodeURIComponent(cert.imageUrl!)}`}
                    alt={cert.name}
                    className="max-h-full w-auto max-w-full object-contain rounded-sm select-none"
                  />
                ) : isReady ? (
                  <iframe
                    src={`${cert.imageUrl}#page=1&zoom=page-fit&view=FitV&toolbar=1`}
                    title={cert.name}
                    className="w-full h-full border-0 bg-white"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 animate-pulse">
                    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            ) : cert.imageUrl && !imgError ? (
              <div className="relative w-full h-[62vh] sm:h-[68vh] md:h-[72vh] flex items-center justify-center p-1 sm:p-2">
                <img
                  src={cert.imageUrl}
                  alt={cert.name}
                  onError={() => setImgError(true)}
                  className="max-h-full w-auto max-w-full object-contain rounded-sm border border-border bg-white"
                />
              </div>
            ) : (
              <div className="certificate-modal-panel w-full py-8">
                <div className="certificate-sheet shadow-lg">
                  <p
                    className="font-semibold tracking-wider uppercase text-sm sm:text-base"
                    style={{ color: cert.color || '#4F46E5' }}
                  >
                    {cert.org}
                  </p>
                  <p className="font-outfit text-xs sm:text-sm text-[#9A8F7B] tracking-widest uppercase my-3">
                    Certificate of Completion
                  </p>
                  <h3 className="font-outfit text-xl sm:text-3xl font-bold leading-tight max-w-[620px] text-zinc-900">
                    {cert.name}
                  </h3>
                  <span
                    className="w-12 h-12 mt-6 border-4 rounded-full shadow-[inset_0_0_0_6px_#FFFEFA]"
                    style={{ borderColor: cert.color || '#4F46E5' }}
                    aria-hidden="true"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

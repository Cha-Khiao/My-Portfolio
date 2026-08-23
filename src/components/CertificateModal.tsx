'use client';

import * as React from 'react';
import { X, ExternalLink, FileText } from 'lucide-react';
import { CertificateData } from '@/lib/initial-data';

interface CertificateModalProps {
  cert: CertificateData | null;
  onClose: () => void;
}

export function CertificateModal({ cert, onClose }: CertificateModalProps) {
  const [imgError, setImgError] = React.useState(false);

  React.useEffect(() => {
    setImgError(false);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-zoom-out"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-[860px] animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="btn-close-modal absolute -top-4 -right-4 z-20 w-10 h-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {isPdf ? (
          <div className="p-3 bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center justify-center min-h-[min(580px,75vh)]">
            <div className="w-full flex items-center justify-between px-3 py-2 bg-zinc-900 rounded-lg mb-2 text-xs text-white">
              <span className="flex items-center gap-2 font-medium truncate">
                <FileText className="w-4 h-4 text-rose-400" /> {cert.name} (PDF Document)
              </span>
              <a
                href={cert.imageUrl}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[11px] text-white flex items-center gap-1 transition-colors"
              >
                เปิดไฟล์ PDF แยก <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <iframe
              src={`${cert.imageUrl}#toolbar=0`}
              title={cert.name}
              className="w-full h-[min(520px,68vh)] rounded-lg border-0 bg-white"
            />
          </div>
        ) : cert.imageUrl && !imgError ? (
          <div className="p-3 bg-zinc-950 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center min-h-[min(560px,72vh)]">
            <img
              src={cert.imageUrl}
              alt={cert.name}
              onError={() => setImgError(true)}
              className="max-h-[min(560px,72vh)] w-full object-contain rounded"
            />
          </div>
        ) : (
          <div className="certificate-modal-panel">
            <div className="certificate-sheet">
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
  );
}

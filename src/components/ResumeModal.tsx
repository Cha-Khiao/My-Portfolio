'use client';

import * as React from 'react';
import { X, ExternalLink, FileText, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  resumeUrl: string;
  name: string;
  onClose: () => void;
}

export function ResumeModal({ isOpen, resumeUrl, name, onClose }: ResumeModalProps) {
  const [imgError, setImgError] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [zoom, setZoom] = React.useState(1);

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
    setZoom(1);
  }, [resumeUrl]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !resumeUrl) return null;

  const isPdf =
    resumeUrl.toLowerCase().endsWith('.pdf') ||
    resumeUrl.includes('.pdf') ||
    resumeUrl.startsWith('data:application/pdf');

  const handleZoomIn = () => setZoom((prev) => Math.min(Number((prev + 0.25).toFixed(2)), 3.0));
  const handleZoomOut = () => setZoom((prev) => Math.max(Number((prev - 0.25).toFixed(2)), 0.75));
  const handleResetZoom = () => setZoom(1);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-zoom-out"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-4xl max-h-[96vh] my-auto flex flex-col animate-in fade-in zoom-in-95 duration-200">
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

        {/* Modal Window - Auto Hugs Content */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[94vh]">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-3.5 sm:px-5 py-2.5 sm:py-3 border-b border-border bg-tag-bg/80 flex-shrink-0 gap-2">
            <div className="min-w-0 pr-2">
              <h3 className="font-outfit text-xs sm:text-sm md:text-base font-bold text-foreground truncate flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-500" /> Resume — {name}
              </h3>
              <p className="text-[11px] sm:text-xs text-fg-secondary mt-0.5">
                {isPdf ? 'เอกสาร PDF เรซูเม่' : 'รูปภาพเรซูเม่'}
              </p>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {/* Zoom Controls (Active for Mobile/Image View) */}
              {(isMobile || !isPdf) && (
                <div className="flex items-center bg-background/80 border border-border rounded-lg p-0.5 shadow-sm">
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    disabled={zoom <= 0.75}
                    className="p-1 hover:bg-tag-bg rounded text-fg-secondary hover:text-foreground disabled:opacity-30 transition-colors"
                    title="ซูมออก"
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleResetZoom}
                    className="px-1.5 text-[11px] font-mono font-semibold text-fg-secondary hover:text-foreground transition-colors"
                    title="รีเซ็ตขนาด 100%"
                  >
                    {Math.round(zoom * 100)}%
                  </button>
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    disabled={zoom >= 3.0}
                    className="p-1 hover:bg-tag-bg rounded text-fg-secondary hover:text-foreground disabled:opacity-30 transition-colors"
                    title="ซูมเข้า"
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-primary px-3.5 sm:px-5 py-1.5 text-xs sm:text-sm gap-1.5 shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5" /> <span className="hidden xs:inline">เปิดดู</span>เต็มจอ
              </a>
            </div>
          </div>

          {/* Main Content Area - Desktop Native PDF / Mobile Zoomable High-Res Image */}
          <div className="p-1 sm:p-2 overflow-hidden flex flex-col items-center justify-center bg-card">
            {isPdf ? (
              isMobile ? (
                /* Mobile: Hugging Aspect-Ratio Viewport with Smooth 2D Pan & Zoom */
                <div className="relative w-full max-h-[78vh] overflow-auto flex items-center justify-center p-2 sm:p-3 bg-zinc-950/90 rounded-sm [scrollbar-gutter:stable]">
                  <div
                    style={{
                      transform: `scale(${zoom})`,
                      transformOrigin: 'center center',
                      transition: 'transform 0.15s ease-out',
                    }}
                    className="flex items-center justify-center min-w-full"
                  >
                    <img
                      src={`/api/certificates/thumbnail?url=${encodeURIComponent(resumeUrl)}`}
                      alt={`Resume - ${name}`}
                      className="max-h-[74vh] w-auto max-w-full object-contain rounded-sm shadow-xl select-none"
                    />
                  </div>
                </div>
              ) : (
                /* Desktop: Native High-Speed PDFium Frame */
                <div className="w-full h-[76vh] sm:h-[80vh] md:h-[84vh] rounded-sm overflow-hidden border border-border bg-white shadow-inner">
                  <iframe
                    src={`${resumeUrl}#page=1&view=FitH&toolbar=1`}
                    title={`Resume - ${name}`}
                    className="w-full h-full border-0 bg-white"
                  />
                </div>
              )
            ) : !imgError ? (
              <div className="relative w-full max-h-[78vh] overflow-auto flex items-center justify-center p-2 sm:p-3 bg-zinc-950/90 rounded-sm [scrollbar-gutter:stable]">
                <div
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.15s ease-out',
                  }}
                  className="flex items-center justify-center min-w-full"
                >
                  <img
                    src={resumeUrl}
                    alt={`Resume - ${name}`}
                    onError={() => setImgError(true)}
                    className="max-h-[74vh] w-auto max-w-full object-contain rounded-sm shadow-xl"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center p-8 space-y-3">
                <FileText className="w-12 h-12 text-fg-tertiary mx-auto" />
                <p className="text-sm text-fg-secondary">ไม่สามารถแสดงตัวอย่างไฟล์ได้โดยตรง</p>
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary px-4 py-2 text-xs inline-flex items-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> เปิดดูแยกในแท็บใหม่
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

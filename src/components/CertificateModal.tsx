'use client';

import * as React from 'react';
import { X, ExternalLink, ZoomIn, ZoomOut, RotateCcw, Move } from 'lucide-react';
import { CertificateData } from '@/lib/initial-data';

interface CertificateModalProps {
  cert: CertificateData | null;
  onClose: () => void;
}

export function CertificateModal({ cert, onClose }: CertificateModalProps) {
  const [imgError, setImgError] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [zoom, setZoom] = React.useState(1);
  const [pan, setPan] = React.useState({ x: 0, y: 0 });

  const isDraggingRef = React.useRef(false);
  const startPosRef = React.useRef({ x: 0, y: 0 });
  const startPanRef = React.useRef({ x: 0, y: 0 });

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
    setZoom(1);
    setPan({ x: 0, y: 0 });
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

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(Number((prev + 0.5).toFixed(2)), 3.0));
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(Number((prev - 0.5).toFixed(2)), 1.0);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Touch Drag / Pan Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoom <= 1) return;
    const touch = e.touches[0];
    isDraggingRef.current = true;
    startPosRef.current = { x: touch.clientX, y: touch.clientY };
    startPanRef.current = { ...pan };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || zoom <= 1) return;
    const touch = e.touches[0];
    const dx = touch.clientX - startPosRef.current.x;
    const dy = touch.clientY - startPosRef.current.y;
    setPan({
      x: startPanRef.current.x + dx,
      y: startPanRef.current.y + dy,
    });
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    e.preventDefault();
    isDraggingRef.current = true;
    startPosRef.current = { x: e.clientX, y: e.clientY };
    startPanRef.current = { ...pan };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || zoom <= 1) return;
    e.preventDefault();
    const dx = e.clientX - startPosRef.current.x;
    const dy = e.clientY - startPosRef.current.y;
    setPan({
      x: startPanRef.current.x + dx,
      y: startPanRef.current.y + dy,
    });
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Double Tap to toggle Zoom
  const handleDoubleTap = () => {
    if (zoom > 1) {
      handleResetZoom();
    } else {
      setZoom(2.0);
    }
  };

  const renderImageUrl = isPdf
    ? `/api/certificates/thumbnail?url=${encodeURIComponent(cert.imageUrl!)}`
    : cert.imageUrl || '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-hidden"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-zoom-out"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-4xl mx-auto my-auto flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="btn-close-modal absolute -top-3.5 -right-3 sm:-top-4 sm:-right-3.5 z-30 w-8 h-8 sm:w-9 sm:h-9 shadow-xl"
          aria-label="Close"
          title="ปิด"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Card */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl flex flex-col w-full max-h-[92vh]">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 sm:py-3 border-b border-border bg-tag-bg/90 flex-shrink-0 gap-3">
            <div className="min-w-0 pr-2">
              <h3 className="font-outfit text-xs sm:text-sm md:text-base font-bold text-foreground truncate">
                {cert.name}
              </h3>
              <p className="text-[10px] sm:text-xs text-fg-secondary mt-0.5 flex items-center gap-1.5 truncate">
                <span className="font-semibold" style={{ color: cert.color || '#4F46E5' }}>{cert.org}</span>
                {isPdf && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-500 font-mono font-bold">
                    PDF
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Zoom Controls (Active for Mobile/Image View) */}
              {(isMobile || !isPdf) && (
                <div className="flex items-center bg-background/90 border border-border rounded-lg p-0.5 shadow-sm">
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    disabled={zoom <= 1.0}
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

              {cert.imageUrl && (
                <a
                  href={cert.imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary px-3 sm:px-4 py-1.5 text-xs sm:text-sm gap-1.5 shadow-sm flex-shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> <span className="hidden xs:inline">เปิดดู</span>เต็มจอ
                </a>
              )}
            </div>
          </div>

          {/* Main Viewer Area */}
          <div className="p-2 sm:p-3 flex flex-col items-center justify-center bg-card overflow-hidden w-full">
            {isPdf && !isMobile ? (
              /* Desktop: Native High-Speed PDFium Frame */
              <div className="w-full h-[64vh] sm:h-[70vh] md:h-[76vh] rounded-sm overflow-hidden border border-border bg-white shadow-inner">
                {isReady ? (
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
            ) : renderImageUrl && !imgError ? (
              /* Mobile & Image View: Touch/Drag Pan & Zoom Viewport (100% Zero-Clipping) */
              <div
                className="relative w-full h-[62vh] sm:h-[70vh] md:h-[76vh] overflow-hidden bg-zinc-950/95 rounded-sm flex items-center justify-center select-none"
                style={{ cursor: zoom > 1 ? (isDraggingRef.current ? 'grabbing' : 'grab') : 'default', touchAction: zoom > 1 ? 'none' : 'auto' }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onDoubleClick={handleDoubleTap}
              >
                {/* Visual Drag Instruction Badge when Zoomed */}
                {zoom > 1 && (
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none bg-black/70 text-white/90 text-[10px] px-2.5 py-1 rounded-full backdrop-blur-sm flex items-center gap-1.5 shadow-md animate-in fade-in duration-150">
                    <Move className="w-3 h-3 text-sky-400" /> แตะลากเพื่อเลื่อนดูทุกส่วน
                  </div>
                )}

                <div
                  style={{
                    transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
                    transformOrigin: 'center center',
                    transition: isDraggingRef.current ? 'none' : 'transform 0.15s ease-out',
                    willChange: 'transform',
                  }}
                  className="flex items-center justify-center max-w-full max-h-full pointer-events-none"
                >
                  <img
                    src={renderImageUrl}
                    alt={cert.name}
                    onError={() => setImgError(true)}
                    className="max-h-[58vh] sm:max-h-[66vh] md:max-h-[72vh] max-w-[95%] w-auto object-contain rounded shadow-2xl pointer-events-auto"
                  />
                </div>
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

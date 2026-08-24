'use client';

import * as React from 'react';
import { ZoomIn, ZoomOut, Loader2 } from 'lucide-react';

interface PdfModalViewerProps {
  url: string;
  alt?: string;
}

export function PdfModalViewer({ url, alt = 'PDF Document' }: PdfModalViewerProps) {
  const [zoom, setZoom] = React.useState(1);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const pdfPageRef = React.useRef<any>(null);
  const renderTaskRef = React.useRef<any>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  // 1. Load PDF document on mount
  React.useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError(false);
    setZoom(1);

    async function loadDocument() {
      try {
        const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

        if (typeof window !== 'undefined') {
          pdfjsLib.GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.mjs`;
        }

        // Fetch binary data directly on main thread
        const res = await fetch(url);
        if (!res.ok) throw new Error('Fetch failed');
        const buf = await res.arrayBuffer();

        const doc = await pdfjsLib.getDocument({
          data: new Uint8Array(buf),
          cMapUrl: typeof window !== 'undefined' ? `${window.location.origin}/cmaps/` : '/cmaps/',
          cMapPacked: true,
          enableXfa: false,
        }).promise;

        const page = await doc.getPage(1);
        if (isCancelled) return;

        pdfPageRef.current = page;
        setLoading(false);
      } catch (err) {
        console.error('PDF load error:', err);
        if (!isCancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    if (url) {
      loadDocument();
    }

    return () => {
      isCancelled = true;
    };
  }, [url]);

  // 2. Render Page to Canvas at High-DPI whenever zoom changes
  React.useEffect(() => {
    if (!pdfPageRef.current || !canvasRef.current || !containerRef.current) return;

    const page = pdfPageRef.current;
    const canvas = canvasRef.current;
    const container = containerRef.current;

    // Calculate base scale to fit container width
    const containerWidth = container.clientWidth ? Math.max(300, container.clientWidth - 32) : 600;
    const unscaledViewport = page.getViewport({ scale: 1 });
    const fitScale = containerWidth / unscaledViewport.width;

    // Total scale incorporating user zoom
    const targetScale = fitScale * zoom;

    // High-DPI multiplier (2x for Retina / mobile screens) for razor-sharp vector text
    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 2, 3) : 2;

    const viewport = page.getViewport({ scale: targetScale * dpr });

    // Cancel any existing render in flight
    if (renderTaskRef.current) {
      try {
        renderTaskRef.current.cancel();
      } catch (e) {}
    }

    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);

    // Display CSS dimensions in CSS pixels (1/dpr of canvas pixel resolution)
    canvas.style.width = `${Math.round(viewport.width / dpr)}px`;
    canvas.style.height = `${Math.round(viewport.height / dpr)}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };

    // @ts-ignore
    const task = page.render(renderContext);
    renderTaskRef.current = task;

    task.promise.catch((err: any) => {
      if (err?.name !== 'RenderingCancelledException') {
        console.warn('Render error:', err);
      }
    });
  }, [zoom, loading]);

  const handleZoomIn = () => setZoom((prev) => Math.min(Number((prev + 0.25).toFixed(2)), 3.0));
  const handleZoomOut = () => setZoom((prev) => Math.max(Number((prev - 0.25).toFixed(2)), 0.75));
  const handleResetZoom = () => setZoom(1);

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-zinc-900 rounded-sm">
        <p className="text-sm text-zinc-300 mb-3">ไม่สามารถแสดงผลเวกเตอร์ได้โดยตรง</p>
        <a href={url} target="_blank" rel="noreferrer" className="btn-primary px-4 py-2 text-xs">
          เปิดดูแยกในแท็บใหม่
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      {/* Zoom Control Bar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-1.5 bg-zinc-900/90 border-b border-border/40 text-white flex-shrink-0">
        <span className="text-[11px] font-mono font-medium text-zinc-400">Vector PDF</span>
        <div className="flex items-center gap-1 bg-zinc-800/90 border border-zinc-700/60 rounded-lg p-0.5 shadow-sm">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoom <= 0.75}
            className="p-1 hover:bg-zinc-700 rounded text-zinc-300 hover:text-white disabled:opacity-30 transition-colors"
            title="ซูมออก"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            className="px-1.5 text-[11px] font-mono font-semibold text-zinc-300 hover:text-white transition-colors"
            title="รีเซ็ตขนาด 100%"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoom >= 3.0}
            className="p-1 hover:bg-zinc-700 rounded text-zinc-300 hover:text-white disabled:opacity-30 transition-colors"
            title="ซูมเข้า"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Scrollable Viewport with Dynamic Razor-Sharp Canvas */}
      <div
        ref={containerRef}
        className="relative w-full max-h-[74vh] sm:max-h-[78vh] overflow-auto p-3 sm:p-5 bg-zinc-950/95 rounded-b-sm"
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/80 z-10">
            <Loader2 className="w-7 h-7 text-indigo-500 animate-spin" />
          </div>
        )}
        <div className="w-fit min-w-full min-h-full flex items-center justify-center m-auto">
          <canvas
            ref={canvasRef}
            className="shadow-2xl rounded-sm block bg-white"
          />
        </div>
      </div>
    </div>
  );
}

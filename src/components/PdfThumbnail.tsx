'use client';

import * as React from 'react';
import { FileText } from 'lucide-react';

interface PdfThumbnailProps {
  url: string;
  alt?: string;
  className?: string;
}

export function PdfThumbnail({ url, alt = 'PDF Preview', className = '' }: PdfThumbnailProps) {
  const [dataUrl, setDataUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function renderPdf() {
      try {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

        const loadingTask = pdfjsLib.getDocument({
          url,
          cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
          cMapPacked: true,
        });

        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        // Render at high resolution
        const unscaledViewport = page.getViewport({ scale: 1 });
        const scale = Math.max(2, 600 / unscaledViewport.width);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) throw new Error('Cannot get canvas 2d context');

        const renderContext = {
          canvasContext: ctx,
          viewport,
        };

        // @ts-ignore
        await page.render(renderContext).promise;

        if (isMounted) {
          setDataUrl(canvas.toDataURL('image/png'));
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (url) {
      renderPdf();
    }

    return () => {
      isMounted = false;
    };
  }, [url]);

  if (dataUrl) {
    return (
      <img
        src={dataUrl}
        alt={alt}
        className={`w-full h-full object-contain bg-white select-none ${className}`}
      />
    );
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 animate-pulse">
        <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Clean, lightweight fallback (never an unscaled iframe that overflows the card)
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-3 bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 text-center select-none">
      <FileText className="w-8 h-8 text-rose-500 mb-1.5 opacity-90" />
      <span className="text-[11px] font-bold text-foreground line-clamp-2 px-1 leading-tight">{alt}</span>
      <span className="text-[9px] text-fg-tertiary mt-1">แตะเพื่อเปิดดูเอกสาร PDF</span>
    </div>
  );
}

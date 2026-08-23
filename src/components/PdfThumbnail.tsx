'use client';

import * as React from 'react';

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

        // Render at high resolution (scale 2.0) for ultra-sharp text and graphics
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

        // Render PDF page into canvas
        // @ts-ignore
        await page.render(renderContext).promise;

        if (isMounted) {
          setDataUrl(canvas.toDataURL('image/png'));
          setLoading(false);
        }
      } catch (err) {
        console.warn('PDF.js rendering fallback:', err);
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
        className={`w-full h-full object-cover select-none ${className}`}
      />
    );
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white/80 dark:bg-zinc-900/80 animate-pulse">
        <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Pure fallback if rendering error
  return (
    <iframe
      src={`${url}#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
      title={alt}
      className={`w-full h-full border-0 pointer-events-none bg-white ${className}`}
    />
  );
}

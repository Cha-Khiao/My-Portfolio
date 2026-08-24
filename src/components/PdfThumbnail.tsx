'use client';

import * as React from 'react';

interface PdfThumbnailProps {
  url: string;
  alt?: string;
  org?: string;
  color?: string;
  className?: string;
}

export function PdfThumbnail({
  url,
  alt = 'PDF Preview',
  org = '',
  color = '#2563EB',
  className = '',
}: PdfThumbnailProps) {
  const [dataUrl, setDataUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;

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
        }
      } catch (err) {
        // Silent fallback to certificate sheet
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

  // Instant, beautiful certificate preview sheet (Zero loading lag, perfect for mobile)
  return (
    <div className="certificate-sheet w-full h-full p-3 sm:p-4 flex flex-col justify-between select-none">
      <div>
        <p
          className="text-[10px] font-bold tracking-wider uppercase truncate"
          style={{ color: color || '#2563EB' }}
        >
          {org || 'Certificate'}
        </p>
        <p className="font-outfit text-[8px] sm:text-[9px] text-[#9A8F7B] tracking-widest uppercase my-1">
          Certificate of Completion
        </p>
        <h3 className="font-outfit text-xs sm:text-sm font-bold leading-snug line-clamp-2 text-zinc-900">
          {alt}
        </h3>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span
          className="w-4 h-4 border-2 rounded-full shadow-[inset_0_0_0_2px_#FFFEFA]"
          style={{ borderColor: color || '#2563EB' }}
          aria-hidden="true"
        />
        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600">
          PDF
        </span>
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import { Maximize2 } from 'lucide-react';
import { CertificateData } from '@/lib/initial-data';
import { PdfThumbnail } from '@/components/PdfThumbnail';

interface CertificateCardProps {
  cert: CertificateData;
  onClick: () => void;
}

export function CertificateCard({ cert, onClick }: CertificateCardProps) {
  const { name, org, color, imageUrl } = cert;
  const [imgError, setImgError] = React.useState(false);

  const isPdf = imageUrl ? (
    imageUrl.toLowerCase().endsWith('.pdf') ||
    imageUrl.includes('.pdf') ||
    imageUrl.startsWith('data:application/pdf')
  ) : false;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group linear-card w-full p-2.5 sm:p-3 overflow-hidden text-left cursor-zoom-in flex flex-col justify-between focus-visible:outline-2 focus-visible:outline-accent hover:border-accent/40 transition-all duration-200"
      aria-label={`Open certificate ${name}`}
    >
      {isPdf ? (
        <div className="relative aspect-[1.414/1] w-full overflow-hidden rounded-sm bg-white mb-2.5 shadow-sm">
          {/* Native High-Resolution PDF Thumbnail - 100% Zero Black Bars / Canvas Margin */}
          <PdfThumbnail
            url={imageUrl || ''}
            alt={name}
            className="w-full h-full object-contain bg-white"
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2.5 pointer-events-none z-10">
            <span className="text-[10px] font-medium text-white px-2 py-0.5 rounded bg-black/70 flex items-center gap-1">
              เปิดดูแบบเต็ม <Maximize2 className="w-2.5 h-2.5" />
            </span>
          </div>

          <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-rose-500 text-white shadow-sm pointer-events-none z-10">
            PDF
          </span>
        </div>
      ) : imageUrl && !imgError ? (
        <div className="relative aspect-[1.414/1] w-full flex items-center justify-center overflow-hidden rounded-sm bg-white dark:bg-zinc-900 mb-2.5">
          {/* Crisp Clean Rectangular Certificate - No glow */}
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="max-h-full max-w-full object-contain rounded-sm"
          />
          <span className="absolute bottom-2.5 right-2.5 p-1.5 rounded-lg bg-background/80 text-foreground border border-border opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-20">
            <Maximize2 className="w-3.5 h-3.5" />
          </span>
        </div>
      ) : (
        <div className="certificate-sheet mb-2.5 shadow-sm">
          <p
            className="text-[10px] font-bold tracking-wider uppercase"
            style={{ color: color || '#2563EB' }}
          >
            {org}
          </p>
          <p className="font-outfit text-[9px] text-[#9A8F7B] tracking-widest uppercase my-1">
            Certificate of Completion
          </p>
          <h3 className="font-outfit text-sm font-bold leading-snug max-w-[230px] text-zinc-900">
            {name}
          </h3>
          <span
            className="w-5 h-5 mt-2.5 border-2 rounded-full shadow-[inset_0_0_0_3px_#FFFEFA]"
            style={{ borderColor: color || '#2563EB' }}
            aria-hidden="true"
          />
        </div>
      )}

      <div className="px-1 pt-1 flex items-center justify-between">
        <div className="min-w-0">
          <h4 className="font-outfit text-xs sm:text-sm font-bold text-foreground group-hover:text-accent transition-colors truncate">
            {name}
          </h4>
          <p className="text-[11px] text-fg-secondary mt-0.5 truncate">{org}</p>
        </div>
        <div className="p-1 rounded-md text-fg-tertiary group-hover:text-foreground transition-colors flex-shrink-0 ml-2">
          <Maximize2 className="w-3.5 h-3.5" />
        </div>
      </div>
    </button>
  );
}

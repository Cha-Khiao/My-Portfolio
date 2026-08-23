'use client';

import * as React from 'react';
import { Maximize2, Award, FileText } from 'lucide-react';
import { CertificateData } from '@/lib/initial-data';

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
      className="group linear-card w-full p-3 overflow-hidden text-left cursor-zoom-in flex flex-col justify-between focus-visible:outline-2 focus-visible:outline-accent"
      aria-label={`Open certificate ${name}`}
    >
      {isPdf ? (
        <div className="relative h-[166px] flex flex-col items-center justify-center rounded-lg bg-gradient-to-b from-zinc-900 to-zinc-950 border border-border/80 mb-2.5 p-4 text-center">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 mb-2 shadow-inner group-hover:scale-110 transition-transform">
            <FileText className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-bold text-white uppercase tracking-wider">
            PDF Certificate
          </span>
          <span className="text-[10px] text-fg-tertiary mt-0.5 line-clamp-1">
            {org}
          </span>
          <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-medium bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
            เปิดดู <Maximize2 className="w-2.5 h-2.5" />
          </span>
        </div>
      ) : imageUrl && !imgError ? (
        <div className="relative h-[166px] flex items-center justify-center overflow-hidden rounded-lg bg-zinc-950/80 border border-border/60 mb-2.5">
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain p-1 group-hover:scale-[1.02] transition-transform duration-200"
          />
          <span className="absolute bottom-2 right-2 p-1 rounded-md bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity">
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
        <div>
          <h4 className="font-outfit text-xs font-bold text-foreground group-hover:text-accent transition-colors line-clamp-1">
            {name}
          </h4>
          <p className="text-[11px] text-fg-secondary mt-0.5">{org}</p>
        </div>
        <div className="p-1 rounded-md text-fg-tertiary group-hover:text-foreground transition-colors">
          <Maximize2 className="w-3.5 h-3.5" />
        </div>
      </div>
    </button>
  );
}

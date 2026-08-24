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
  const [imgError, setImgError] = React.useState(false);

  if (!url) return null;

  const isPdf = url.toLowerCase().includes('.pdf');
  const thumbnailUrl = isPdf
    ? `/api/certificates/thumbnail?url=${encodeURIComponent(url)}`
    : url;

  if (imgError) {
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

  return (
    <img
      src={thumbnailUrl}
      alt={alt}
      loading="lazy"
      onError={() => setImgError(true)}
      className={`w-full h-full object-contain bg-white select-none ${className}`}
    />
  );
}

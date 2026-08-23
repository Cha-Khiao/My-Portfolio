'use client';

import * as React from 'react';
import { ExternalLink, Calendar, Building2, UserCheck, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { ActivityData } from '@/lib/initial-data';

interface ActivityCardProps {
  activity: ActivityData;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const { title, role, org, period, desc, images, linkUrl } = activity;
  const imageList = Array.isArray(images) ? images.filter(Boolean) : [];

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = '';
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null && imageList.length > 0) {
      setLightboxIndex((lightboxIndex + 1) % imageList.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null && imageList.length > 0) {
      setLightboxIndex((lightboxIndex - 1 + imageList.length) % imageList.length);
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight' && lightboxIndex !== null && imageList.length > 0) {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % imageList.length : null));
      }
      if (e.key === 'ArrowLeft' && lightboxIndex !== null && imageList.length > 0) {
        setLightboxIndex((prev) => (prev !== null ? (prev - 1 + imageList.length) % imageList.length : null));
      }
    };
    if (lightboxIndex !== null) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, imageList.length]);

  return (
    <>
      <article className="linear-card p-5 sm:p-6 rounded-2xl flex flex-col justify-between transition-all duration-200 hover:border-accent/40 group">
        <div>
          {/* Top Metadata Row: Eye-Catching Period Badge & Org */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
            <div className="flex flex-wrap items-center gap-2.5">
              {period && (
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 rounded-full bg-accent text-white shadow-sm ring-2 ring-accent/20">
                  <Calendar className="w-3.5 h-3.5" /> {period}
                </span>
              )}
              {org && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-fg-secondary">
                  <Building2 className="w-3.5 h-3.5 text-fg-tertiary" /> {org}
                </span>
              )}
            </div>

            {linkUrl && (
              <a
                href={linkUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-fg-tertiary hover:text-accent flex items-center gap-1 transition-colors ml-auto font-medium"
                title="เปิดลิงก์ที่เกี่ยวข้อง"
              >
                <span>รายละเอียด</span> <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Title */}
          <h3 className="font-outfit text-base sm:text-lg font-bold text-foreground group-hover:text-accent transition-colors leading-snug">
            {title}
          </h3>

          {/* Role badge if specified */}
          {role && (
            <p className="text-xs font-semibold text-accent/90 mt-1.5 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-accent" /> {role}
            </p>
          )}

          {/* Description */}
          {desc && (
            <p className="text-xs sm:text-sm text-fg-secondary leading-relaxed mt-2.5 whitespace-pre-line font-normal">
              {desc}
            </p>
          )}
        </div>

        {/* Multi-Image Gallery Layout */}
        {imageList.length > 0 && (
          <div className="mt-4 pt-3.5 border-t border-border/60">
            {/* Header: Photo count badge */}
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-semibold text-fg-secondary flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-accent" /> รูปภาพกิจกรรม ({imageList.length})
              </span>
            </div>

            {/* 1 Image: Full Preview */}
            {imageList.length === 1 ? (
              <div
                onClick={() => openLightbox(0)}
                className="relative h-44 sm:h-52 rounded-xl overflow-hidden border border-border bg-zinc-900 cursor-pointer group/img shadow-sm"
              >
                <img
                  src={imageList[0]}
                  alt={title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                />
              </div>
            ) : imageList.length === 2 ? (
              /* 2 Images: 2-Column Grid */
              <div className="grid grid-cols-2 gap-2">
                {imageList.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => openLightbox(idx)}
                    className="relative h-32 sm:h-36 rounded-xl overflow-hidden border border-border bg-zinc-900 cursor-pointer group/img shadow-sm"
                  >
                    <img
                      src={img}
                      alt={`${title} - ภาพที่ ${idx + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            ) : (
              /* 3+ Images: 3-Column Collage with "+N" Overlay on the last slot */
              <div className="grid grid-cols-3 gap-2">
                {imageList.slice(0, 3).map((img, idx) => {
                  const isLastSlot = idx === 2;
                  const remainingCount = imageList.length - 2;

                  return (
                    <div
                      key={idx}
                      onClick={() => openLightbox(idx)}
                      className="relative h-24 sm:h-28 rounded-xl overflow-hidden border border-border bg-zinc-900 cursor-pointer group/img shadow-sm"
                    >
                      <img
                        src={img}
                        alt={`${title} - ภาพที่ ${idx + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                      />
                      {isLastSlot && imageList.length > 3 && (
                        <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px] flex flex-col items-center justify-center text-white group-hover/img:bg-black/55 transition-colors">
                          <span className="font-outfit font-extrabold text-base sm:text-lg leading-none">
                            +{remainingCount}
                          </span>
                          <span className="text-[9px] font-medium text-white/80 mt-0.5">ภาพ</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </article>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && imageList[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          {/* Close Button - Red style matching other modals */}
          <button
            type="button"
            onClick={closeLightbox}
            className="btn-close-modal absolute top-4 right-4 sm:top-6 sm:right-6 z-50 w-9 h-9 sm:w-10 sm:h-10 shadow-2xl flex items-center justify-center cursor-pointer"
            aria-label="Close Lightbox"
            title="ปิด"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Navigation Controls for Multi-Images */}
          {imageList.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevImage}
                className="absolute left-3 sm:left-6 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors shadow-lg"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="absolute right-3 sm:right-6 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors shadow-lg"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Main Full Image */}
          <div
            className="relative max-w-4xl max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imageList[lightboxIndex]}
              alt={title}
              className="max-h-[80vh] w-auto max-w-full object-contain rounded-lg shadow-2xl border border-white/10"
            />
            {/* Image Counter & Title */}
            <div className="mt-3 text-center">
              <p className="text-white text-xs sm:text-sm font-medium">{title}</p>
              {imageList.length > 1 && (
                <p className="text-white/60 text-[11px] font-mono mt-0.5">
                  รูปภาพที่ {lightboxIndex + 1} จาก {imageList.length}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

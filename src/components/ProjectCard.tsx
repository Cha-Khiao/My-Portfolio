'use client';

import * as React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import { GithubIcon } from '@/components/icons/GithubIcon';
import { ProjectData } from '@/lib/initial-data';

interface ProjectCardProps {
  project: ProjectData;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { title, desc, preview, demoUrl, githubUrl } = project;
  const [imgError, setImgError] = React.useState(false);
  const [screenshotError, setScreenshotError] = React.useState(false);

  // Resolved fallback URLs
  const targetDemoUrl = demoUrl || `/demo?preview=${preview}`;
  const targetGithubUrl = githubUrl || 'https://github.com/Cha-Khiao';

  // Check if demoUrl is a direct image / uploaded file
  const isImage = demoUrl ? (
    demoUrl.toLowerCase().endsWith('.png') ||
    demoUrl.toLowerCase().endsWith('.jpg') ||
    demoUrl.toLowerCase().endsWith('.jpeg') ||
    demoUrl.toLowerCase().endsWith('.webp') ||
    demoUrl.toLowerCase().endsWith('.svg') ||
    demoUrl.startsWith('/uploads/') ||
    demoUrl.startsWith('data:image/') ||
    demoUrl.includes('supabase.co/storage/v1/object/public')
  ) : false;

  // Check if demoUrl is a live external website URL
  const isWebUrl = demoUrl ? (
    (demoUrl.startsWith('http://') || demoUrl.startsWith('https://')) &&
    !demoUrl.startsWith('/demo') &&
    !isImage
  ) : false;

  // Spotlight State
  const [spotlightPos, setSpotlightPos] = React.useState<{ x: number; y: number; opacity: number }>({
    x: 0,
    y: 0,
    opacity: 0,
  });
  const cardRef = React.useRef<HTMLElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setSpotlightPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setSpotlightPos((prev) => ({ ...prev, opacity: 0 }));
  };

  const renderPreview = () => {
    // 1. Direct Image Preview (Clean Full-Bleed)
    if (isImage && !imgError) {
      return (
        <a
          href={targetDemoUrl}
          target="_blank"
          rel="noreferrer"
          className="group/preview block rounded-xl overflow-hidden border border-border bg-tag-bg mb-3 shadow-sm hover:border-accent/40 transition-all cursor-pointer relative"
          title={`คลิกเพื่อเปิดดู Demo: ${title}`}
        >
          <div className="relative h-[140px] sm:h-[155px] overflow-hidden flex items-center justify-center bg-zinc-900">
            <img
              src={demoUrl}
              alt={title}
              loading="lazy"
              onError={() => setImgError(true)}
              className="relative z-10 w-full h-full object-cover group-hover/preview:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-end justify-between p-2.5 z-20">
              <span className="text-[10px] font-medium text-white px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm flex items-center gap-1">
                เปิด Demo <ExternalLink className="w-2.5 h-2.5" />
              </span>
            </div>
          </div>
        </a>
      );
    }

    // 2. Live Website Automatic Screenshot Preview (Clean Full-Bleed, No Top Browser Bar)
    if (isWebUrl && !screenshotError && demoUrl) {
      const screenshotUrl = `https://s0.wp.com/mshots/v1/${encodeURIComponent(demoUrl)}?w=600&h=380`;

      return (
        <a
          href={targetDemoUrl}
          target="_blank"
          rel="noreferrer"
          className="group/preview block rounded-xl overflow-hidden border border-border bg-tag-bg mb-3 shadow-sm hover:border-accent/40 transition-all cursor-pointer"
          title={`คลิกเพื่อเปิดดู Live Demo: ${title}`}
        >
          <div className="relative h-[140px] sm:h-[155px] overflow-hidden bg-zinc-900">
            <img
              src={screenshotUrl}
              alt={title}
              loading="lazy"
              onError={() => setScreenshotError(true)}
              className="w-full h-full object-cover object-top group-hover/preview:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-end justify-between p-2.5 z-20">
              <span className="text-[10px] font-medium text-white px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm flex items-center gap-1">
                เปิดดูเว็บสด <ExternalLink className="w-2.5 h-2.5" />
              </span>
            </div>
          </div>
        </a>
      );
    }

    // 3. UI Mockup / Template Preview Fallback
    const previewClasses: Record<string, string> = {
      chat: 'from-indigo-900/90 via-indigo-800/80 to-slate-900',
      tasks: 'from-teal-900/90 via-teal-800/80 to-slate-900',
      quiz: 'from-amber-900/90 via-orange-800/80 to-slate-900',
      portfolio: 'from-zinc-900 via-neutral-800 to-zinc-950',
      weather: 'from-sky-900/90 via-sky-800/80 to-slate-900',
      expense: 'from-emerald-900/90 via-emerald-800/80 to-slate-900',
    };

    const gradientClass = previewClasses[preview] || previewClasses.portfolio;

    return (
      <a
        href={targetDemoUrl}
        target="_blank"
        rel="noreferrer"
        className="group/preview block rounded-xl overflow-hidden border border-border bg-tag-bg mb-3 shadow-sm hover:border-accent/40 transition-all cursor-pointer"
        title={`คลิกเพื่อเปิดดู Demo: ${title}`}
      >
        <div className={`relative h-[140px] sm:h-[155px] overflow-hidden bg-gradient-to-br ${gradientClass} flex flex-col justify-between p-3`}>
          {/* Interactive UI Mockup Elements */}
          <div className="relative z-10 my-auto p-2.5 rounded-lg bg-black/30 backdrop-blur-md border border-white/10 shadow-lg group-hover/preview:scale-[1.02] transition-transform duration-200">
            {preview === 'chat' && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                  <div className="w-2/3 h-2.5 rounded bg-indigo-400/40" />
                </div>
                <div className="flex items-center gap-1.5 justify-end">
                  <div className="w-1/2 h-2.5 rounded bg-accent/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-accent" />
                </div>
              </div>
            )}
            {preview === 'tasks' && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded bg-teal-400/80 flex items-center justify-center text-[7px] text-black">✓</span>
                  <div className="h-2 w-3/4 rounded bg-teal-200/30" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded border border-teal-400/60" />
                  <div className="h-2 w-1/2 rounded bg-teal-200/30" />
                </div>
              </div>
            )}
            {preview === 'quiz' && (
              <div className="space-y-1.5">
                <div className="h-2 w-3/4 rounded bg-amber-200/40" />
                <div className="grid grid-cols-2 gap-1.5">
                  <span className="h-4 rounded bg-amber-500/20 border border-amber-400/30 text-[8px] text-amber-200 flex items-center px-1.5">Option A</span>
                  <span className="h-4 rounded bg-amber-500/40 border border-amber-400/60 text-[8px] text-amber-100 flex items-center px-1.5 font-bold">Option B ✓</span>
                </div>
              </div>
            )}
            {preview === 'portfolio' && (
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[9px] font-bold">P.</div>
                <div className="space-y-1 flex-1">
                  <div className="h-2 w-2/3 rounded bg-white/40" />
                  <div className="h-1.5 w-1/2 rounded bg-white/20" />
                </div>
              </div>
            )}
            {preview === 'weather' && (
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-outfit text-lg font-bold text-white leading-none">29°C</div>
                  <div className="text-[9px] text-sky-200 mt-0.5">Partly Cloudy</div>
                </div>
                <div className="w-7 h-7 rounded-full bg-amber-400/80 flex items-center justify-center text-amber-950 text-xs shadow-md">☀️</div>
              </div>
            )}
            {preview === 'expense' && (
              <div className="h-9 flex gap-1.5 items-end">
                <span className="flex-1 rounded-t bg-emerald-400/40 h-[35%]" />
                <span className="flex-1 rounded-t bg-emerald-400/70 h-[70%]" />
                <span className="flex-1 rounded-t bg-emerald-400/50 h-[50%]" />
                <span className="flex-1 rounded-t bg-emerald-400/90 h-[90%]" />
                <span className="flex-1 rounded-t bg-emerald-300 h-[65%]" />
              </div>
            )}
          </div>

          {/* Bottom Live Demo Trigger */}
          <div className="flex items-center justify-between text-[10px] text-white/80 z-10">
            <span className="flex items-center gap-1 font-medium text-white">
              <Sparkles className="w-2.5 h-2.5 text-accent" /> Interactive Demo
            </span>
            <span className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 text-[9px] transition-colors">
              เปิด Demo <ExternalLink className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>
      </a>
    );
  };

  return (
    <article
      ref={cardRef as any}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group linear-card p-3 flex flex-col justify-between overflow-hidden hover:border-accent/40 transition-all duration-200"
    >
      {/* Subtle Silver Cursor Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-200"
        style={{
          opacity: spotlightPos.opacity,
          background: `radial-gradient(350px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(255, 255, 255, 0.05), transparent 80%)`,
        }}
      />

      <div className="relative z-10">
        {/* Clickable Full-Bleed Preview to Demo */}
        {renderPreview()}

        {/* Content Info */}
        <div className="px-1 pt-1 pb-1">
          <div className="flex justify-between items-start mb-1.5 gap-2">
            <h3 className="font-outfit text-base font-bold text-foreground tracking-tight group-hover:text-accent transition-colors">
              {title}
            </h3>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <a
                href={targetGithubUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1 rounded-md text-fg-tertiary hover:text-foreground hover:bg-tag-bg transition-colors"
                title="เปิดดูซอร์สโค้ดบน GitHub"
                aria-label="GitHub Repository"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href={targetDemoUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1 rounded-md text-fg-tertiary hover:text-accent hover:bg-accent/10 transition-colors"
                title="เปิดดู Demo ในแท็บใหม่"
                aria-label="Live Demo in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
          <p className="text-xs font-normal text-fg-secondary leading-relaxed line-clamp-3">
            {desc}
          </p>
        </div>
      </div>
    </article>
  );
}

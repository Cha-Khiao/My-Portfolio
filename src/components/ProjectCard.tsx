'use client';

import * as React from 'react';
import { ExternalLink } from 'lucide-react';
import { GithubIcon } from '@/components/icons/GithubIcon';
import { ProjectData } from '@/lib/initial-data';

interface ProjectCardProps {
  project: ProjectData;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { title, desc, preview, demoUrl, githubUrl } = project;

  // Resolved fallback URLs
  const targetDemoUrl = demoUrl || `/demo?preview=${preview}`;
  const targetGithubUrl = githubUrl || 'https://github.com/Cha-Khiao';

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
    const isLiveUrl = demoUrl && demoUrl.startsWith('http');

    if (isLiveUrl) {
      return (
        <a
          href={targetDemoUrl}
          target="_blank"
          rel="noreferrer"
          className="group/preview block rounded-xl overflow-hidden border border-border bg-tag-bg mb-3 shadow-inner hover:border-accent/40 transition-all cursor-pointer"
          title={`คลิกเพื่อเปิดดู Demo ในแท็บใหม่: ${title}`}
        >
          {/* Full Iframe Live View */}
          <div className="relative h-[135px] sm:h-[140px] overflow-hidden bg-white">
            <iframe
              src={demoUrl}
              title={title}
              loading="lazy"
              tabIndex={-1}
              aria-hidden="true"
              sandbox="allow-scripts allow-same-origin allow-forms"
              className="w-full h-full border-0 pointer-events-none group-hover/preview:scale-[1.02] transition-transform duration-200"
            />
          </div>
        </a>
      );
    }

    const previewClasses: Record<string, string> = {
      chat: 'bg-gradient-to-br from-indigo-700 to-indigo-400',
      tasks: 'bg-gradient-to-br from-teal-700 to-teal-300',
      quiz: 'bg-gradient-to-br from-orange-700 to-orange-300',
      portfolio: 'bg-gradient-to-br from-zinc-800 to-zinc-500',
      weather: 'bg-gradient-to-br from-sky-700 to-sky-300',
      expense: 'bg-gradient-to-br from-emerald-700 to-emerald-300',
    };

    const gradientClass = previewClasses[preview] || previewClasses.portfolio;

    return (
      <a
        href={targetDemoUrl}
        target="_blank"
        rel="noreferrer"
        className="group/preview block rounded-xl overflow-hidden border border-border bg-tag-bg mb-3 shadow-inner hover:border-accent/40 transition-all cursor-pointer"
        title={`คลิกเพื่อเปิดดู Demo ในแท็บใหม่: ${title}`}
      >
        {/* Full-Bleed UI Demo Mockup */}
        <div className={`relative h-[135px] sm:h-[140px] overflow-hidden ${gradientClass}`}>
          <div className="absolute w-40 h-40 rounded-full -right-10 -bottom-16 bg-white/10" />
          <div className="absolute inset-x-3.5 top-3.5 bottom-0 p-3 pt-4 rounded-t-xl bg-card/95 shadow-lg group-hover/preview:scale-[1.02] transition-transform duration-200">
            {preview === 'chat' && (
              <div className="grid gap-2">
                <div className="w-3/4 h-4 rounded-lg rounded-bl-sm bg-accent/20" />
                <div className="w-2/3 h-4 ml-auto rounded-lg rounded-br-sm bg-indigo-500/40" />
                <div className="w-4/5 h-4 rounded-lg rounded-bl-sm bg-accent/20" />
              </div>
            )}
            {preview === 'tasks' && (
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-teal-500/60" />
                  <span className="h-2 w-3/4 rounded bg-fg-secondary/25" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-teal-500/60" />
                  <span className="h-2 w-1/2 rounded bg-fg-secondary/25" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-teal-500/60" />
                  <span className="h-2 w-2/3 rounded bg-fg-secondary/25" />
                </div>
              </div>
            )}
            {preview === 'quiz' && (
              <div className="grid gap-2">
                <span className="h-2.5 w-3/4 rounded bg-fg-secondary/25" />
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <span className="h-6 rounded border border-orange-500/40 bg-orange-500/10" />
                  <span className="h-6 rounded border border-orange-500/40 bg-orange-500/10" />
                </div>
              </div>
            )}
            {preview === 'portfolio' && (
              <div className="flex flex-col items-center pt-1">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-400 mb-1.5 shadow-sm" />
                <span className="h-2 w-1/2 rounded bg-fg-secondary/25" />
              </div>
            )}
            {preview === 'weather' && (
              <div className="pt-1">
                <div className="font-outfit text-2xl font-bold text-foreground leading-none">28°C</div>
                <div className="grid gap-1.5 mt-2.5">
                  <span className="h-2 w-1/2 rounded bg-fg-secondary/25" />
                </div>
              </div>
            )}
            {preview === 'expense' && (
              <div className="h-16 flex gap-2 items-end pt-2">
                <span className="flex-1 rounded-t bg-emerald-500/60 h-[40%]" />
                <span className="flex-1 rounded-t bg-emerald-500/60 h-[75%]" />
                <span className="flex-1 rounded-t bg-emerald-500/60 h-[55%]" />
                <span className="flex-1 rounded-t bg-emerald-500/60 h-[90%]" />
              </div>
            )}
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
      className="group linear-card p-3 flex flex-col justify-between overflow-hidden"
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
        {/* Clickable Full-Bleed Preview to Demo (Opens in New Tab) */}
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

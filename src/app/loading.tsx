import * as React from 'react';

export default function Loading() {
  return (
    <div className="max-w-[920px] mx-auto px-6 pt-24 sm:pt-28 md:pt-32 pb-16 md:pb-24 flex flex-col gap-16 md:gap-20 animate-pulse">
      {/* Hero Skeleton */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full bg-tag-bg/80 ring-4 ring-border/30" />
        <div className="h-8 sm:h-10 w-64 bg-tag-bg/80 rounded-xl" />
        <div className="h-4 w-48 bg-tag-bg/60 rounded-lg" />
        <div className="h-4 w-full max-w-md bg-tag-bg/40 rounded-lg" />
        <div className="flex gap-3 pt-2">
          <div className="h-9 w-28 bg-tag-bg/70 rounded-xl" />
          <div className="h-9 w-28 bg-tag-bg/70 rounded-xl" />
        </div>
      </div>

      {/* About Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-6 w-32 bg-tag-bg/80 rounded-lg" />
          <div className="flex-1 h-px bg-border/40" />
        </div>
        <div className="p-6 sm:p-8 rounded-2xl bg-card/60 border border-border/40 space-y-3">
          <div className="h-4 w-full bg-tag-bg/50 rounded" />
          <div className="h-4 w-5/6 bg-tag-bg/50 rounded" />
          <div className="h-4 w-4/6 bg-tag-bg/50 rounded" />
        </div>
      </div>

      {/* Projects Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-6 w-28 bg-tag-bg/80 rounded-lg" />
          <div className="flex-1 h-px bg-border/40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-5 rounded-2xl bg-card/60 border border-border/40 space-y-3">
              <div className="h-32 rounded-xl bg-tag-bg/60" />
              <div className="h-5 w-3/4 bg-tag-bg/70 rounded" />
              <div className="h-3 w-full bg-tag-bg/40 rounded" />
              <div className="h-3 w-2/3 bg-tag-bg/40 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

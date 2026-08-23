'use client';

import * as React from 'react';
import { Bot, Briefcase, Zap, Globe, Code, Cpu, Sparkles, Terminal, Wrench, Layers } from 'lucide-react';
import { SkillGroup, defaultSkills } from '@/lib/initial-data';

interface SkillsSectionProps {
  skills?: SkillGroup[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  bot: Bot,
  briefcase: Briefcase,
  zap: Zap,
  globe: Globe,
  code: Code,
  cpu: Cpu,
  sparkles: Sparkles,
  terminal: Terminal,
  wrench: Wrench,
  layers: Layers,
};

export function SkillsSection({ skills }: SkillsSectionProps) {
  const displayGroups = skills && skills.length > 0 ? skills : defaultSkills;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {displayGroups.map((group) => {
        const IconComponent = (group.icon && iconMap[group.icon.toLowerCase()]) || Bot;
        return (
          <div
            key={group.id || group.title}
            className="linear-card p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="p-2 rounded-lg bg-tag-bg border border-border text-accent">
                  <IconComponent className="w-4 h-4" />
                </div>
                <h3 className="font-outfit text-base font-bold text-foreground tracking-tight">
                  {group.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-fg-secondary leading-relaxed mb-5">
                {group.desc}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-border/60">
              {group.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs font-medium px-2.5 py-1 rounded-md bg-tag-bg border border-tag-border text-foreground hover:border-border-hover hover:scale-105 transition-all cursor-default shadow-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

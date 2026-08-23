'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  ExternalLink,
  Shield,
  Layers,
  Award,
  Terminal,
  CheckCircle2,
  Copy,
  Check,
  Code2,
  Cpu,
  Globe,
  ArrowUpRight,
  Maximize2,
} from 'lucide-react';
import { GithubIcon } from '@/components/icons/GithubIcon';

export default function StyleDemoPage() {
  const [activeTab, setActiveTab] = React.useState<'elevated' | 'comparison'>('elevated');
  const [copied, setCopied] = React.useState(false);
  const [filterCategory, setFilterCategory] = React.useState<'all' | 'fullstack' | 'ai'>('all');

  // Spotlight State for Elevated Linear Card
  const [spotlightPos, setSpotlightPos] = React.useState<{ x: number; y: number; opacity: number }>({
    x: 0,
    y: 0,
    opacity: 0,
  });
  const cardRef = React.useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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

  const copyEmail = () => {
    navigator.clipboard.writeText('kingdomdemon703@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#08080A] text-zinc-100 font-sans selection:bg-blue-500/20 selection:text-blue-200 pb-24 bg-grid-pattern">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#08080A]/85 border-b border-zinc-800/80 px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" /> Elevated Linear &amp; Apple Precision
              </h1>
              <p className="text-[11px] text-zinc-400">
                มิติชัด คอนทราสต์สูง ไม่กลืนพื้นหลัง พร้อมลูกเล่นและแอนิเมชันที่ลื่นไหล
              </p>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex p-1 rounded-xl bg-zinc-900 border border-zinc-800">
            <button
              onClick={() => setActiveTab('elevated')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'elevated' ? 'bg-zinc-100 text-zinc-950 shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              ✨ สไตล์ใหม่ (Elevated Linear)
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'comparison' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              📊 เทียบจุดที่ปรับปรุง
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 pt-8">
        {activeTab === 'elevated' ? (
          <div className="space-y-12">
            {/* ========================================================================= */}
            {/* HERO SHOWCASE */}
            {/* ========================================================================= */}
            <section className="relative rounded-2xl border border-zinc-800/90 bg-[#101014] p-6 sm:p-10 overflow-hidden shadow-2xl">
              {/* Subtle Ambient Refined Glow behind avatar (Crisp & not oversaturated) */}
              <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Avatar with Double Crisp Ring */}
                <div className="relative flex-shrink-0 group">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl p-1 bg-gradient-to-b from-zinc-700 to-zinc-800 shadow-xl">
                    <img
                      src="https://avatars.githubusercontent.com/u/72403948?v=4"
                      alt="Prasopphol"
                      className="w-full h-full rounded-xl object-cover"
                    />
                  </div>
                  {/* Active Status Badge with Pulsing Green Radar */}
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-[#101014]" />
                  </span>
                </div>

                {/* Profile Details */}
                <div className="flex-1 text-center md:text-left space-y-3">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/90 border border-zinc-700/80 text-zinc-200 text-xs font-medium tracking-wide">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Available for Internship &amp; Projects
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono">
                      CS @ KMUTT
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Prasopphol Talhom
                  </h2>
                  <p className="text-sm font-medium text-zinc-300">
                    Computer Science Student · Full-Stack Web Developer
                  </p>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-2xl">
                    เปลี่ยนไอเดียให้เป็นเว็บแอปที่ใช้งานจริง ด้วย Next.js, TypeScript, PostgreSQL และการผสาน AI อย่างเป็นระบบ
                  </p>

                  {/* Interactive Quick Buttons */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                    <button
                      onClick={copyEmail}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold transition-all duration-150 shadow-md hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" /> คัดลอกอีเมลแล้ว!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> ติดต่อทางอีเมล (คลิกคัดลอก)
                        </>
                      )}
                    </button>

                    <a
                      href="https://github.com/prasopphol"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs font-medium transition-all"
                    >
                      <GithubIcon className="w-3.5 h-3.5" /> GitHub Profile
                    </a>

                    <Link
                      href="/#projects"
                      className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
                    >
                      ดูผลงานทั้งหมด <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* ========================================================================= */}
            {/* INTERACTIVE CARDS & BENTO PREVIEWS */}
            {/* ========================================================================= */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-400" /> Featured Projects (High-Contrast macOS Card)
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    ลองเลื่อนเมาส์ชี้บนการ์ด เพื่อทดสอบ <strong>Subtle Silver Spotlight &amp; Dynamic Border Highlight</strong>
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs">
                  <button
                    onClick={() => setFilterCategory('all')}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      filterCategory === 'all' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    ทั้งหมด
                  </button>
                  <button
                    onClick={() => setFilterCategory('fullstack')}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      filterCategory === 'fullstack' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Web App
                  </button>
                  <button
                    onClick={() => setFilterCategory('ai')}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      filterCategory === 'ai' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    AI System
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* PROJECT CARD 1 (Interactive Spotlight & macOS Window) */}
                <div
                  ref={cardRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  className="group relative rounded-2xl border border-zinc-800/90 bg-[#121216] p-5 shadow-xl hover:border-zinc-700 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between"
                >
                  {/* Subtle Silver Cursor Spotlight Layer */}
                  <div
                    className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300"
                    style={{
                      opacity: spotlightPos.opacity,
                      background: `radial-gradient(400px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(255, 255, 255, 0.06), transparent 80%)`,
                    }}
                  />

                  {/* Dynamic Border Illumination */}
                  <div
                    className="pointer-events-none absolute -inset-px rounded-2xl border border-zinc-400/40 transition-opacity duration-300"
                    style={{
                      opacity: spotlightPos.opacity,
                      maskImage: `radial-gradient(220px circle at ${spotlightPos.x}px ${spotlightPos.y}px, black, transparent)`,
                      WebkitMaskImage: `radial-gradient(220px circle at ${spotlightPos.x}px ${spotlightPos.y}px, black, transparent)`,
                    }}
                  />

                  <div className="relative z-10">
                    {/* macOS Browser Mockup Top Bar */}
                    <div className="rounded-xl overflow-hidden border border-zinc-800 bg-[#09090C] mb-4 flex flex-col shadow-inner">
                      <div className="flex items-center justify-between px-3 py-2 bg-zinc-900/90 border-b border-zinc-800 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 group-hover:bg-rose-500 transition-colors" />
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 group-hover:bg-amber-500 transition-colors" />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 group-hover:bg-emerald-500 transition-colors" />
                        </div>
                        {/* URL Pill */}
                        <div className="px-3 py-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-300 font-mono flex items-center gap-1.5">
                          <Globe className="w-3 h-3 text-zinc-500" /> ai-assistant.vercel.app
                        </div>
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                          Live Demo
                        </span>
                      </div>

                      {/* Mockup Screen Content */}
                      <div className="h-32 p-3.5 bg-gradient-to-b from-[#0C0C10] to-[#08080A] flex flex-col justify-center gap-2">
                        <div className="self-end px-3 py-1.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-xs text-blue-200 max-w-[85%]">
                          ช่วยสรุปโครงสร้าง Next.js 15 และ Prisma ให้หน่อย
                        </div>
                        <div className="self-start px-3 py-1.5 rounded-xl bg-zinc-800/70 border border-zinc-700/80 text-xs text-zinc-200 max-w-[85%] flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                          Next.js App Router + Prisma PostgreSQL เชื่อมต่อผ่าน API Routes
                        </div>
                      </div>
                    </div>

                    {/* Card Title & Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                        AI Chat Assistant
                      </h4>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono">
                          Next.js
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono">
                          Prisma
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                      ผู้ช่วยสนทนาที่ตอบคำถามจากบริบท พร้อมหน้าจอสำหรับติดตามบทสนทนาอย่างเป็นระบบและปลอดภัย
                    </p>
                  </div>

                  {/* Action Links */}
                  <div className="relative z-10 pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                    <span className="text-zinc-500 text-[11px]">สถานะ: ใช้งานจริงบน Vercel</span>
                    <div className="flex items-center gap-3">
                      <span className="group-hover:text-white flex items-center gap-1 transition-colors">
                        ดู Demo <ExternalLink className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* PROJECT CARD 2 */}
                <div className="group relative rounded-2xl border border-zinc-800/90 bg-[#121216] p-5 shadow-xl hover:border-zinc-700 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between">
                  <div className="relative z-10">
                    {/* macOS Browser Mockup Top Bar */}
                    <div className="rounded-xl overflow-hidden border border-zinc-800 bg-[#09090C] mb-4 flex flex-col shadow-inner">
                      <div className="flex items-center justify-between px-3 py-2 bg-zinc-900/90 border-b border-zinc-800 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 group-hover:bg-rose-500 transition-colors" />
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 group-hover:bg-amber-500 transition-colors" />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 group-hover:bg-emerald-500 transition-colors" />
                        </div>
                        <div className="px-3 py-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-300 font-mono flex items-center gap-1.5">
                          <Globe className="w-3 h-3 text-zinc-500" /> taskflow.app
                        </div>
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                          Live Demo
                        </span>
                      </div>

                      {/* Mockup Screen Content */}
                      <div className="h-32 p-3 bg-gradient-to-b from-[#0C0C10] to-[#08080A] flex flex-col justify-center gap-2">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs">
                          <span className="text-zinc-200 flex items-center gap-2 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> ระบบ Admin Dashboard CRUD
                          </span>
                          <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            Done
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/50 border border-zinc-800/80 text-xs">
                          <span className="text-zinc-400 flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full border border-zinc-600" /> ออกแบบ Dark / Light Theme
                          </span>
                          <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 px-1.5 py-0.5 rounded">
                            Review
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                        Task Management Flow
                      </h4>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono">
                          TypeScript
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono">
                          Tailwind
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                      ระบบจัดการงานที่ช่วยจัดหมวดหมู่ ติดตามสถานะความคืบหน้า และกำหนดวันครบกำหนดอย่างแม่นยำ
                    </p>
                  </div>

                  <div className="relative z-10 pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                    <span className="text-zinc-500 text-[11px]">สถานะ: พร้อมใช้งาน</span>
                    <div className="flex items-center gap-3">
                      <span className="group-hover:text-white flex items-center gap-1 transition-colors">
                        ดู Demo <ExternalLink className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ========================================================================= */}
            {/* CERTIFICATE & SKILLS SHOWCASE */}
            {/* ========================================================================= */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Certificate Sheet Card with Foil Reflection */}
              <div className="rounded-2xl border border-zinc-800/90 bg-[#121216] p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" /> Certificate Display (Metallic Seal Sheet)
                  </h3>
                  <span className="text-[10px] text-zinc-500 font-mono">Zoom Enabled</span>
                </div>

                <div className="group relative rounded-xl border border-amber-500/20 bg-gradient-to-b from-[#181610] to-[#100F0A] p-5 overflow-hidden cursor-pointer hover:border-amber-500/40 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                      Coursera Verified
                    </span>
                    <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      ★
                    </div>
                  </div>
                  <h4 className="text-base font-bold text-zinc-100 group-hover:text-amber-200 transition-colors">
                    Introduction to Artificial Intelligence
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1">Issued by IBM / Coursera</p>
                  <p className="text-[11px] text-zinc-500 mt-3 flex items-center gap-1">
                    <Maximize2 className="w-3 h-3" /> คลิกเพื่อขยายดูภาพขนาดเต็ม (Modal Zoom)
                  </p>
                </div>
              </div>

              {/* Skills Interactive Matrix */}
              <div className="rounded-2xl border border-zinc-800/90 bg-[#121216] p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-blue-400" /> Skills &amp; Tech Stack Pills
                  </h3>
                  <span className="text-[10px] text-zinc-500 font-mono">Interactive Badges</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
                      Core Development
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Prisma ORM'].map(
                        (skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-xs font-medium text-zinc-200 hover:text-white transition-all cursor-default shadow-sm hover:scale-105"
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
                      Workflow &amp; AI
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {['AI Pair Programming', 'Git & GitHub', 'Vercel Deployment', 'Clean Code Architecture'].map(
                        (skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-xs font-medium text-zinc-300 hover:text-white transition-all cursor-default shadow-sm hover:scale-105"
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        ) : (
          /* ========================================================================= */
          /* COMPARISON TABLE OF IMPROVEMENTS */
          /* ========================================================================= */
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-zinc-800 bg-[#101014]">
              <h3 className="text-lg font-bold text-white mb-4">
                สรุปการแก้ปัญหาและจุดที่ยกระดับขึ้นในสไตล์นี้:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-2">
                  <span className="text-xs font-bold text-rose-400 uppercase">ปัญหาของ Cyber Violet เดิม</span>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    ❌ สีม่วง/นีออนฟุ้งเยอะเกินไป ทำให้ดูลายตา และสีการ์ดกลืนกับแสงด้านหลัง
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2">
                  <span className="text-xs font-bold text-amber-400 uppercase">ปัญหาของ Apple Clean เดิม</span>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    ❌ เรียบและจืดเกินไป ขาดลูกเล่น Interactive ทำให้หน้าเว็บดูนิ่งและธรรมดา
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase">✨ สิ่งที่ Elevated Linear ทำได้</span>
                  <p className="text-xs text-zinc-200 leading-relaxed">
                    ✅ <strong>คมชัด คอนทราสต์สูง</strong> พื้นหลังดำ Slate แยกจากการ์ดอย่างชัดเจน<br />
                    ✅ <strong>ลูกเล่นแน่น</strong> ทั้ง macOS Frame, Subtle Spotlight, Click-to-Copy, Tech Hover Pills
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

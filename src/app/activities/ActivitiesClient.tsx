'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, X, Calendar, ChevronDown } from 'lucide-react';
import { ActivityCard } from '@/components/ActivityCard';
import { ActivityData } from '@/lib/initial-data';

const ITEMS_PER_PAGE = 6;

interface ActivitiesClientProps {
  initialActivities: ActivityData[];
}

export function AllActivitiesClient({ initialActivities }: ActivitiesClientProps) {
  const [activities] = React.useState<ActivityData[]>(initialActivities);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedYear, setSelectedYear] = React.useState<string>('all');
  const [visibleCount, setVisibleCount] = React.useState(ITEMS_PER_PAGE);

  // Extract unique periods/years for filter pills
  const periods = React.useMemo(() => {
    const years = Array.from(new Set(activities.map((a) => a.period).filter(Boolean)));
    return years;
  }, [activities]);

  // Filter & Search Logic
  const filteredActivities = React.useMemo(() => {
    return activities.filter((a) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        a.title.toLowerCase().includes(q) ||
        (a.org && a.org.toLowerCase().includes(q)) ||
        (a.role && a.role.toLowerCase().includes(q)) ||
        (a.desc && a.desc.toLowerCase().includes(q));
      const matchesYear = selectedYear === 'all' || a.period === selectedYear;
      return matchesSearch && matchesYear;
    });
  }, [activities, searchQuery, selectedYear]);

  const visibleActivities = filteredActivities.slice(0, visibleCount);
  const hasMore = visibleCount < filteredActivities.length;

  return (
    <div className="max-w-[920px] mx-auto px-6 pt-24 sm:pt-28 md:pt-32 pb-16 md:pb-24">
      {/* Header */}
      <div className="border-b border-border pb-6 mb-8">
        <Link
          href="/"
          className="group inline-flex items-center gap-3 mb-6 focus-visible:outline-none"
        >
          <span className="btn-orange w-9 h-9 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 group-hover:-translate-x-1 transition-all">
            <ArrowLeft className="w-4 h-4 text-white" />
          </span>
          <span className="text-xs sm:text-sm font-semibold text-fg-secondary group-hover:text-foreground transition-colors">
            กลับสู่หน้าแรก
          </span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-outfit font-extrabold text-2xl sm:text-4xl text-foreground tracking-tight">
              All Activities &amp; Experience
            </h1>
            <p className="text-fg-secondary text-xs sm:text-sm mt-1.5">
              ประวัติการทำกิจกรรม โครงการ เวิร์กช็อป จิตอาสา และประสบการณ์ทั้งหมด
            </p>
          </div>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-tag-bg border border-border text-fg-tertiary self-start sm:self-auto">
            {filteredActivities.length} กิจกรรม
          </span>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-3 mb-8">
        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-tertiary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(ITEMS_PER_PAGE);
            }}
            placeholder="ค้นหาชื่อกิจกรรม บทบาท หน้าที่ หรือหน่วยงาน..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-card border border-border focus:border-accent text-xs sm:text-sm outline-none shadow-sm placeholder:text-fg-tertiary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-fg-tertiary hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills (Periods / Years) */}
        {periods.length > 1 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs text-fg-tertiary mr-1 font-medium">ช่วงเวลา:</span>
            <button
              onClick={() => {
                setSelectedYear('all');
                setVisibleCount(ITEMS_PER_PAGE);
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedYear === 'all'
                  ? 'bg-accent text-white shadow-sm'
                  : 'bg-card border border-border text-fg-secondary hover:border-accent/40'
              }`}
            >
              ทั้งหมด ({activities.length})
            </button>
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => {
                  setSelectedYear(p || 'all');
                  setVisibleCount(ITEMS_PER_PAGE);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedYear === p
                    ? 'bg-accent text-white shadow-sm'
                    : 'bg-card border border-border text-fg-secondary hover:border-accent/40'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid of Activities */}
      {filteredActivities.length === 0 ? (
        <div className="linear-card p-12 text-center rounded-2xl">
          <Calendar className="w-10 h-10 text-fg-tertiary mx-auto mb-3 opacity-40" />
          <h3 className="font-outfit text-base font-semibold text-foreground">
            ไม่พบกิจกรรมที่ตรงกับคำค้นหา
          </h3>
          <p className="text-xs text-fg-secondary mt-1">
            ลองปรับคำค้นหา หรือเลือกตัวกรองช่วงเวลาทั้งหมด
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedYear('all');
            }}
            className="btn-secondary px-4 py-1.5 text-xs mt-4"
          >
            ล้างคำค้นหา
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {visibleActivities.map((act) => (
            <ActivityCard key={act.id} activity={act} />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-10">
          <button
            onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
            className="btn-secondary px-6 py-2.5 text-xs sm:text-sm font-semibold gap-2 shadow-sm hover:border-accent/40"
          >
            แสดงกิจกรรมเพิ่มเติม ({filteredActivities.length - visibleCount}) <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

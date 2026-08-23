'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, X, Award, ChevronDown } from 'lucide-react';
import { CertificateCard } from '@/components/CertificateCard';
import { CertificateModal } from '@/components/CertificateModal';
import { CertificateData } from '@/lib/initial-data';

const ITEMS_PER_PAGE = 6;

interface CertificatesClientProps {
  initialCertificates: CertificateData[];
}

export function AllCertificatesClient({ initialCertificates }: CertificatesClientProps) {
  const [certificates] = React.useState<CertificateData[]>(initialCertificates);
  const [selectedCert, setSelectedCert] = React.useState<CertificateData | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedOrg, setSelectedOrg] = React.useState<string>('all');
  const [visibleCount, setVisibleCount] = React.useState(ITEMS_PER_PAGE);

  // Extract unique organizations for filter pills
  const organizations = React.useMemo(() => {
    const orgs = Array.from(new Set(certificates.map((c) => c.org).filter(Boolean)));
    return orgs;
  }, [certificates]);

  // Filter & Search Logic
  const filteredCertificates = React.useMemo(() => {
    return certificates.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.org.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesOrg = selectedOrg === 'all' || c.org === selectedOrg;
      return matchesSearch && matchesOrg;
    });
  }, [certificates, searchQuery, selectedOrg]);

  const visibleCertificates = filteredCertificates.slice(0, visibleCount);
  const hasMore = visibleCount < filteredCertificates.length;

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
              All Certificates
            </h1>
            <p className="text-fg-secondary text-xs sm:text-sm mt-1.5">
              ใบรับรองและประกาศนียบัตรหลักสูตรด้าน AI, Web Development และการเขียนโปรแกรม
            </p>
          </div>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-tag-bg border border-border text-fg-tertiary self-start sm:self-auto">
            {filteredCertificates.length} ใบรับรอง
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
            placeholder="ค้นหาชื่อหลักสูตร หรือสถาบัน เช่น AI, Coursera, Google, Python..."
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

        {/* Organization Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => {
              setSelectedOrg('all');
              setVisibleCount(ITEMS_PER_PAGE);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              selectedOrg === 'all'
                ? 'btn-primary text-xs'
                : 'btn-secondary text-fg-secondary'
            }`}
          >
            ทั้งหมด ({certificates.length})
          </button>
          {organizations.map((org) => {
            const count = certificates.filter((c) => c.org === org).length;
            return (
              <button
                key={org}
                onClick={() => {
                  setSelectedOrg(org);
                  setVisibleCount(ITEMS_PER_PAGE);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  selectedOrg === org
                    ? 'btn-primary text-xs'
                    : 'btn-secondary text-fg-secondary'
                }`}
              >
                {org} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Certificates Grid */}
      {visibleCertificates.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-card border border-border space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-tag-bg flex items-center justify-center mx-auto text-fg-tertiary">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-outfit text-base font-bold text-foreground">ไม่พบใบรับรองที่ตรงกับคำค้นหา</h3>
          <p className="text-xs text-fg-secondary">ลองเปลี่ยนคำค้นหา หรือเลือกล้างตัวกรอง</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedOrg('all');
            }}
            className="btn-secondary px-4 py-2 text-xs font-medium"
          >
            ล้างการค้นหาทั้งหมด
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {visibleCertificates.map((cert) => (
            <CertificateCard
              key={cert.id}
              cert={cert}
              onClick={() => setSelectedCert(cert)}
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-10">
          <button
            onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
            className="btn-secondary px-6 py-3 text-xs sm:text-sm font-medium gap-2 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            แสดงใบรับรองเพิ่มเติม ({filteredCertificates.length - visibleCount} รายการ)
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modal View */}
      <CertificateModal
        cert={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </div>
  );
}

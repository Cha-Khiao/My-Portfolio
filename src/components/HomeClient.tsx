'use client';

import * as React from 'react';
import Link from 'next/link';
import { Mail, Phone, FileText } from 'lucide-react';
import { GithubIcon } from '@/components/icons/GithubIcon';
import { LineIcon } from '@/components/icons/LineIcon';
import { ProjectCard } from '@/components/ProjectCard';
import { CertificateCard } from '@/components/CertificateCard';
import { CertificateModal } from '@/components/CertificateModal';
import { ResumeModal } from '@/components/ResumeModal';
import { LineModal } from '@/components/LineModal';
import { ActivityCard } from '@/components/ActivityCard';
import { SkillsSection } from '@/components/SkillsSection';
import {
  CertificateData,
  ProjectData,
  ProfileData,
  SkillGroup,
  ActivityData,
  defaultProfile,
  defaultSkills,
} from '@/lib/initial-data';

interface HomeClientProps {
  initialProfile: ProfileData;
  initialProjects: ProjectData[];
  initialCertificates: CertificateData[];
  initialActivities: ActivityData[];
}

export function HomeClient({
  initialProfile,
  initialProjects,
  initialCertificates,
  initialActivities,
}: HomeClientProps) {
  const [profile] = React.useState<ProfileData>(initialProfile);
  const [projects] = React.useState<ProjectData[]>(initialProjects);
  const [certificates] = React.useState<CertificateData[]>(initialCertificates);
  const [activities] = React.useState<ActivityData[]>(initialActivities);
  const [selectedCert, setSelectedCert] = React.useState<CertificateData | null>(null);
  const [isLineModalOpen, setIsLineModalOpen] = React.useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = React.useState(false);

  const featuredProjects = React.useMemo(() => {
    return [...projects]
      .filter((p) => p.featured)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .slice(0, 3);
  }, [projects]);
  const displayProjects = featuredProjects.length ? featuredProjects : projects.slice(0, 3);

  const featuredCerts = React.useMemo(() => {
    return [...certificates]
      .filter((c) => c.featured)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .slice(0, 3);
  }, [certificates]);
  const displayCerts = featuredCerts.length ? featuredCerts : certificates.slice(0, 3);

  const featuredActivities = React.useMemo(() => {
    return [...activities]
      .filter((a) => a.featured)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [activities]);
  const displayActivities = featuredActivities.length ? featuredActivities : activities;

  const emailAddress = profile.email || defaultProfile.email;
  const githubAddress = profile.githubUrl || defaultProfile.githubUrl;
  const lineUrl = profile.lineUrl || defaultProfile.lineUrl || 'https://line.me/ti/p/swWxGS9q9y';
  const lineQrUrl = profile.lineQrUrl || defaultProfile.lineQrUrl || '/images/line-qr.jpg';
  const phoneNumber = profile.phone || defaultProfile.phone || '064-965-9703';

  // Parse skills from profile.skillsJson
  let parsedSkills: SkillGroup[] = defaultSkills;
  if (profile.skillsJson) {
    try {
      const parsed = JSON.parse(profile.skillsJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        parsedSkills = parsed;
      }
    } catch (e) {
      console.warn('Failed to parse skillsJson');
    }
  }

  return (
    <div className="max-w-[920px] mx-auto px-6 pt-24 sm:pt-28 md:pt-32 pb-16 md:pb-24 flex flex-col gap-16 md:gap-20">
      {/* ========================================================================= */}
      {/* HERO SECTION */}
      {/* ========================================================================= */}
      <section id="top" className="flex flex-col items-center text-center">
        {/* Prominent Avatar with Balanced Ring */}
        <div className="relative mb-6">
          <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full p-1.5 bg-gradient-to-b from-border to-border-hover shadow-xl">
            <img
              src={profile.imageUrl || defaultProfile.imageUrl}
              alt={`Profile photo of ${profile.name}`}
              className="w-full h-full rounded-full object-cover bg-tag-bg"
            />
          </div>
        </div>

        <h1 className="font-outfit font-extrabold text-3xl sm:text-5xl text-foreground tracking-tight mb-2">
          {profile.name}
        </h1>
        <p className="text-sm sm:text-base font-semibold text-accent mb-3 tracking-wide">
          {profile.role}
        </p>
        <p className="text-sm sm:text-base text-fg-secondary font-normal max-w-xl leading-relaxed mb-6">
          {profile.tagline}
        </p>

        {/* Quick CTA Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {profile.resumeUrl ? (
            <button
              type="button"
              onClick={() => setIsResumeModalOpen(true)}
              className="btn-primary px-6 py-2.5 text-xs sm:text-sm gap-1.5 cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98]"
              title="เปิดดูเรซูเม่"
            >
              <FileText className="w-3.5 h-3.5" /> Resume
            </button>
          ) : null}
          <a
            href="#contact"
            className="btn-contact px-6 py-2.5 text-xs sm:text-sm gap-1.5"
          >
            <Mail className="w-3.5 h-3.5" /> ติดต่อ
          </a>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ABOUT SECTION */}
      {/* ========================================================================= */}
      <section id="about" className="scroll-mt-24">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="font-outfit font-bold text-lg sm:text-xl text-foreground tracking-tight whitespace-nowrap">
            {profile.aboutHeading || 'About Me'}
          </h2>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="linear-card p-6 sm:p-8">
          <div className="text-fg-secondary text-sm sm:text-base leading-loose space-y-4">
            <p>{profile.about1}</p>
            {profile.about2 && <p>{profile.about2}</p>}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PROJECTS SECTION */}
      {/* ========================================================================= */}
      <section id="projects" className="scroll-mt-24">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="font-outfit font-bold text-lg sm:text-xl text-foreground tracking-tight whitespace-nowrap">
            {profile.projectsHeading || 'Projects'}
          </h2>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {displayProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/projects"
            className="btn-primary px-6 py-2.5 text-xs sm:text-sm font-semibold shadow-md hover:scale-[1.02] active:scale-[0.98]"
          >
            ดูผลงานทั้งหมด
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ACTIVITIES & EXPERIENCE SECTION */}
      {/* ========================================================================= */}
      {displayActivities.length > 0 && (
        <section id="activities" className="scroll-mt-24">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="font-outfit font-bold text-lg sm:text-xl text-foreground tracking-tight whitespace-nowrap">
              {profile.activitiesHeading || 'Activities & Experience'}
            </h2>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {displayActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/activities"
              className="btn-primary px-6 py-2.5 text-xs sm:text-sm font-semibold shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              ดูกิจกรรมและประสบการณ์ทั้งหมด
            </Link>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* CERTIFICATES SECTION */}
      {/* ========================================================================= */}
      <section id="certificates" className="scroll-mt-24">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="font-outfit font-bold text-lg sm:text-xl text-foreground tracking-tight whitespace-nowrap">
            {profile.certificatesHeading || 'Certificates'}
          </h2>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {displayCerts.map((cert) => (
            <CertificateCard
              key={cert.id}
              cert={cert}
              onClick={() => setSelectedCert(cert)}
            />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/certificates"
            className="btn-cert px-6 py-2.5 text-xs sm:text-sm font-semibold shadow-md hover:scale-[1.02] active:scale-[0.98]"
          >
            ดูใบรับรองทั้งหมด
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SKILLS SECTION */}
      {/* ========================================================================= */}
      <section id="skills" className="scroll-mt-24">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="font-outfit font-bold text-lg sm:text-xl text-foreground tracking-tight whitespace-nowrap">
            {profile.skillsHeading || 'Skills & Capabilities'}
          </h2>
          <div className="flex-1 h-px bg-border" />
        </div>
        <SkillsSection skills={parsedSkills} />
      </section>

      {/* ========================================================================= */}
      {/* CONTACT SECTION */}
      {/* ========================================================================= */}
      <section id="contact" className="scroll-mt-24 py-4">
        <div className="linear-card p-8 sm:p-10 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="font-outfit font-bold text-2xl text-foreground tracking-tight">
              {profile.contactHeading || 'Get in Touch'}
            </h2>
            <p className="text-fg-secondary text-sm leading-relaxed">
              {profile.contactDesc || 'ผมกำลังมองหาโอกาสในการฝึกงาน เพื่อนำทักษะด้านการประยุกต์ใช้ AI ทำงานอย่างเป็นระบบ การสร้างระบบอัตโนมัติ (GAS) และการจัดการงานดิจิทัลไปช่วยซัพพอร์ตทีม พร้อมเรียนรู้และพัฒนาตัวเองอย่างเต็มที่ หากองค์กรหรือทีมของท่านกำลังเปิดรับนักศึกษาฝึกงาน สามารถติดต่อพูดคุยกับผมได้เลยครับ'}
            </p>
            
            {/* Contact Actions */}
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-2.5 sm:gap-3 pt-2">
              <a
                href={`tel:${phoneNumber.replace(/-/g, '')}`}
                className="btn-phone px-4 sm:px-5 py-2.5 text-xs sm:text-sm gap-1.5 sm:gap-2 whitespace-nowrap font-mono"
                title="โทรศัพท์"
              >
                <Phone className="w-4 h-4" /> {phoneNumber}
              </a>

              <a
                href={`mailto:${emailAddress}`}
                className="btn-primary px-4 sm:px-5 py-2.5 text-xs sm:text-sm gap-1.5 sm:gap-2 whitespace-nowrap"
                title="ส่งอีเมล"
              >
                <Mail className="w-4 h-4" /> ส่งอีเมล
              </a>

              <button
                onClick={() => setIsLineModalOpen(true)}
                className="btn-line px-4 sm:px-5 py-2.5 text-xs sm:text-sm gap-1.5 sm:gap-2 whitespace-nowrap"
                title="ติดต่อผ่าน LINE"
              >
                <LineIcon className="w-4 h-4" /> LINE
              </button>

              <a
                href={githubAddress}
                target="_blank"
                rel="noreferrer"
                className="btn-github px-4 sm:px-5 py-2.5 text-xs sm:text-sm gap-1.5 sm:gap-2 whitespace-nowrap"
              >
                <GithubIcon className="w-4 h-4" /> GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <CertificateModal
        cert={selectedCert}
        onClose={() => setSelectedCert(null)}
      />

      <ResumeModal
        isOpen={isResumeModalOpen}
        resumeUrl={profile.resumeUrl || ''}
        name={profile.name}
        onClose={() => setIsResumeModalOpen(false)}
      />

      <LineModal
        isOpen={isLineModalOpen}
        lineUrl={lineUrl}
        lineQrUrl={lineQrUrl}
        lineId={profile.lineId}
        onClose={() => setIsLineModalOpen(false)}
      />
    </div>
  );
}

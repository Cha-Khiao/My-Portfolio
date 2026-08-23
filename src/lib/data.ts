import { prisma } from './prisma';
import {
  ProfileData,
  ProjectData,
  CertificateData,
  ActivityData,
  defaultProfile,
  defaultProjects,
  defaultCertificates,
  defaultActivities,
} from './initial-data';

export function extractYearFromPeriod(period?: string | null): number {
  if (!period) return 0;
  const matches = period.match(/\b(19\d\d|20\d\d|25\d\d)\b/g);
  if (!matches || matches.length === 0) return 0;
  const years = matches.map((y) => {
    const val = parseInt(y, 10);
    return val > 2400 ? val - 543 : val; // Convert Thai Buddhist year to CE for unified sort
  });
  return Math.max(...years);
}

export async function getProfile(): Promise<ProfileData> {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: 'profile' },
    });
    if (!profile) return defaultProfile;
    return profile;
  } catch (error) {
    console.warn('Database error in getProfile, using fallback data');
    return defaultProfile;
  }
}

export async function getProjects(): Promise<ProjectData[]> {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
    if (!projects || projects.length === 0) return defaultProjects;
    return projects;
  } catch (error) {
    console.warn('Database error in getProjects, using fallback data');
    return defaultProjects;
  }
}

export async function getCertificates(): Promise<CertificateData[]> {
  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: { createdAt: 'desc' },
    });
    if (!certificates || certificates.length === 0) return defaultCertificates;
    return certificates;
  } catch (error) {
    console.warn('Database error in getCertificates, using fallback data');
    return defaultCertificates;
  }
}

export async function getActivities(): Promise<ActivityData[]> {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: { createdAt: 'desc' },
    });
    if (!activities || activities.length === 0) return defaultActivities;
    const parsed = activities.map((act) => {
      let images: string[] = [];
      try {
        images = JSON.parse(act.imagesJson || '[]');
      } catch (e) {
        images = [];
      }
      return {
        ...act,
        images,
      };
    });

    // Sort by latest year descending, then by creation date descending
    return parsed.sort((a, b) => {
      const yearA = extractYearFromPeriod(a.period);
      const yearB = extractYearFromPeriod(b.period);
      if (yearA !== yearB) return yearB - yearA;
      return 0;
    });
  } catch (error) {
    console.warn('Database error in getActivities, using fallback data');
    return defaultActivities;
  }
}


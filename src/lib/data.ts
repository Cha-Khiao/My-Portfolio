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
      orderBy: { order: 'asc' },
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
      orderBy: { order: 'asc' },
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
      orderBy: { order: 'asc' },
    });
    if (!activities || activities.length === 0) return defaultActivities;
    return activities.map((act) => {
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
  } catch (error) {
    console.warn('Database error in getActivities, using fallback data');
    return defaultActivities;
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { defaultProfile } from '@/lib/initial-data';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: 'profile' },
    });
    return NextResponse.json(profile || defaultProfile);
  } catch (err) {
    // Graceful fallback if database is not reachable yet
    console.warn('Database error fetching profile, using fallback data');
    return NextResponse.json(defaultProfile);
  }
}

export async function PUT(req: NextRequest) {
  const isAuth = await isAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    const updated = await prisma.profile.upsert({
      where: { id: 'profile' },
      update: {
        name: data.name,
        role: data.role,
        tagline: data.tagline,
        aboutHeading: data.aboutHeading ?? defaultProfile.aboutHeading,
        about1: data.about1,
        about2: data.about2,
        projectsHeading: data.projectsHeading ?? defaultProfile.projectsHeading,
        certificatesHeading: data.certificatesHeading ?? defaultProfile.certificatesHeading,
        skillsHeading: data.skillsHeading ?? defaultProfile.skillsHeading,
        contactHeading: data.contactHeading ?? defaultProfile.contactHeading,
        contactDesc: data.contactDesc ?? defaultProfile.contactDesc,
        imageUrl: data.imageUrl,
        email: data.email,
        githubUrl: data.githubUrl,
        lineUrl: data.lineUrl ?? defaultProfile.lineUrl,
        lineId: data.lineId ?? '',
        lineQrUrl: data.lineQrUrl ?? defaultProfile.lineQrUrl,
        phone: data.phone ?? defaultProfile.phone,
        skillsJson: data.skillsJson ?? defaultProfile.skillsJson,
      },
      create: {
        id: 'profile',
        name: data.name || defaultProfile.name,
        role: data.role || defaultProfile.role,
        tagline: data.tagline || defaultProfile.tagline,
        aboutHeading: data.aboutHeading || defaultProfile.aboutHeading,
        about1: data.about1 || defaultProfile.about1,
        about2: data.about2 || defaultProfile.about2,
        projectsHeading: data.projectsHeading || defaultProfile.projectsHeading,
        certificatesHeading: data.certificatesHeading || defaultProfile.certificatesHeading,
        skillsHeading: data.skillsHeading || defaultProfile.skillsHeading,
        contactHeading: data.contactHeading || defaultProfile.contactHeading,
        contactDesc: data.contactDesc || defaultProfile.contactDesc,
        imageUrl: data.imageUrl || defaultProfile.imageUrl,
        email: data.email || defaultProfile.email,
        githubUrl: data.githubUrl || defaultProfile.githubUrl,
        lineUrl: data.lineUrl || defaultProfile.lineUrl,
        lineId: data.lineId || '',
        lineQrUrl: data.lineQrUrl || defaultProfile.lineQrUrl,
        phone: data.phone || defaultProfile.phone,
        skillsJson: data.skillsJson || defaultProfile.skillsJson,
      },
    });
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error updating profile' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { defaultCertificates, defaultProfile, defaultProjects } from '@/lib/initial-data';
import { isAuthenticated } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const isAuth = await isAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { target } = await req.json(); // 'profile', 'projects', 'certificates', or 'all'

    if (target === 'profile' || target === 'all') {
      await prisma.profile.upsert({
        where: { id: 'profile' },
        update: defaultProfile,
        create: defaultProfile,
      });
    }

    if (target === 'projects' || target === 'all') {
      for (const p of defaultProjects) {
        const { id, ...data } = p;
        await prisma.project.create({
          data,
        });
      }
    }

    if (target === 'certificates' || target === 'all') {
      for (const c of defaultCertificates) {
        const { id, ...data } = c;
        await prisma.certificate.create({
          data,
        });
      }
    }

    return NextResponse.json({ success: true, message: 'นำเข้าข้อมูลตัวอย่างสำเร็จ' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error seeding data' }, { status: 500 });
  }
}

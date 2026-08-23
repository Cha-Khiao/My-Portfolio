import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { defaultActivities } from '@/lib/initial-data';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function extractYearFromPeriod(period?: string | null): number {
  if (!period) return 0;
  const matches = period.match(/\b(19\d\d|20\d\d|25\d\d)\b/g);
  if (!matches || matches.length === 0) return 0;
  const years = matches.map((y) => {
    const val = parseInt(y, 10);
    return val > 2400 ? val - 543 : val;
  });
  return Math.max(...years);
}

export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const parsed = activities.map((a) => {
      let images: string[] = [];
      try {
        if (a.imagesJson) images = JSON.parse(a.imagesJson);
      } catch (e) {}
      return { ...a, images };
    });

    const sorted = parsed.sort((a, b) => {
      const yearA = extractYearFromPeriod(a.period);
      const yearB = extractYearFromPeriod(b.period);
      if (yearA !== yearB) return yearB - yearA;
      return 0;
    });

    return NextResponse.json(sorted);
  } catch (err) {
    console.warn('Database error fetching activities, using fallback data');
    return NextResponse.json(defaultActivities);
  }
}

export async function POST(req: NextRequest) {
  const isAuth = await isAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    if (!data.title || !data.title.trim()) {
      return NextResponse.json({ error: 'กรุณาระบุชื่อกิจกรรม' }, { status: 400 });
    }

    let imagesJson = '[]';
    if (Array.isArray(data.images)) {
      imagesJson = JSON.stringify(data.images.filter(Boolean));
    } else if (typeof data.imagesJson === 'string') {
      imagesJson = data.imagesJson;
    }

    const activity = await prisma.activity.create({
      data: {
        title: data.title.trim(),
        role: data.role?.trim() || '',
        org: data.org?.trim() || '',
        period: data.period?.trim() || '',
        desc: data.desc?.trim() || '',
        imagesJson,
        linkUrl: data.linkUrl?.trim() || '',
        featured: Boolean(data.featured),
        order: Number(data.order) || 0,
      },
    });

    let images: string[] = [];
    try {
      if (activity.imagesJson) images = JSON.parse(activity.imagesJson);
    } catch (e) {}

    revalidatePath('/');
    revalidatePath('/activities');
    return NextResponse.json({ ...activity, images });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error creating activity' }, { status: 500 });
  }
}

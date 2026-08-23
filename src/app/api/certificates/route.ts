import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { defaultCertificates } from '@/lib/initial-data';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const certs = await prisma.certificate.findMany({
      orderBy: { order: 'asc' },
    });
    if (certs.length === 0) {
      return NextResponse.json(defaultCertificates);
    }
    return NextResponse.json(certs);
  } catch (err) {
    console.warn('Database error fetching certificates, using fallback data');
    return NextResponse.json(defaultCertificates);
  }
}

export async function POST(req: NextRequest) {
  const isAuth = await isAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    const cert = await prisma.certificate.create({
      data: {
        name: data.name,
        org: data.org,
        color: data.color || '#4F46E5',
        imageUrl: data.imageUrl || '',
        featured: Boolean(data.featured),
        order: Number(data.order) || 0,
      },
    });
    return NextResponse.json(cert);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error creating certificate' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const isAuth = await isAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
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

    const updated = await prisma.activity.upsert({
      where: { id },
      update: {
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
      create: {
        id,
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
      if (updated.imagesJson) images = JSON.parse(updated.imagesJson);
    } catch (e) {}

    revalidatePath('/');
    revalidatePath('/activities');
    return NextResponse.json({ ...updated, images });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error updating activity' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const isAuth = await isAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    await prisma.activity.delete({
      where: { id },
    });
    revalidatePath('/');
    revalidatePath('/activities');
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error deleting activity' }, { status: 500 });
  }
}

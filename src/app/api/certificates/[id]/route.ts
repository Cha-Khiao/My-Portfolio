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

    const updated = await prisma.certificate.upsert({
      where: { id },
      update: {
        name: data.name,
        org: data.org,
        color: data.color || '#4F46E5',
        imageUrl: data.imageUrl || '',
        featured: Boolean(data.featured),
        order: Number(data.order) || 1,
      },
      create: {
        id,
        name: data.name,
        org: data.org,
        color: data.color || '#4F46E5',
        imageUrl: data.imageUrl || '',
        featured: Boolean(data.featured),
        order: Number(data.order) || 1,
      },
    });
    revalidatePath('/');
    revalidatePath('/certificates');
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error updating certificate' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const isAuth = await isAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    await prisma.certificate.deleteMany({
      where: { id },
    });
    revalidatePath('/');
    revalidatePath('/certificates');
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error deleting certificate' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
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

    const updated = await prisma.project.upsert({
      where: { id },
      update: {
        title: data.title,
        desc: data.desc,
        preview: data.preview || 'portfolio',
        githubUrl: data.githubUrl || '',
        demoUrl: data.demoUrl || '',
        featured: Boolean(data.featured),
        order: Number(data.order) || 1,
      },
      create: {
        id,
        title: data.title,
        desc: data.desc,
        preview: data.preview || 'portfolio',
        githubUrl: data.githubUrl || '',
        demoUrl: data.demoUrl || '',
        featured: Boolean(data.featured),
        order: Number(data.order) || 1,
      },
    });
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error updating project' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const isAuth = await isAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    await prisma.project.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error deleting project' }, { status: 500 });
  }
}

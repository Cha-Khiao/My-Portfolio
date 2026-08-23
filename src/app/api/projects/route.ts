import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { defaultProjects } from '@/lib/initial-data';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: 'asc' },
    });
    if (projects.length === 0) {
      return NextResponse.json(defaultProjects);
    }
    return NextResponse.json(projects);
  } catch (err) {
    console.warn('Database error fetching projects, using fallback data');
    return NextResponse.json(defaultProjects);
  }
}

export async function POST(req: NextRequest) {
  const isAuth = await isAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    const project = await prisma.project.create({
      data: {
        title: data.title,
        desc: data.desc,
        preview: data.preview || 'portfolio',
        githubUrl: data.githubUrl || '',
        demoUrl: data.demoUrl || '',
        featured: Boolean(data.featured),
        order: Number(data.order) || 0,
      },
    });
    revalidatePath('/');
    revalidatePath('/projects');
    return NextResponse.json(project);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error creating project' }, { status: 500 });
  }
}

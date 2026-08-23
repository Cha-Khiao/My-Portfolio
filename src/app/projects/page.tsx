import { getProjects } from '@/lib/data';
import { AllProjectsClient } from './ProjectsClient';

export const revalidate = 60;

export default async function AllProjectsPage() {
  const projects = await getProjects();
  return <AllProjectsClient initialProjects={projects} />;
}


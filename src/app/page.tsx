import { getProfile, getProjects, getCertificates, getActivities } from '@/lib/data';
import { HomeClient } from '@/components/HomeClient';

// Enable Incremental Static Regeneration (ISR) - revalidates in the background every 60 seconds
export const revalidate = 60;

export default async function HomePage() {
  const [profile, projects, certificates, activities] = await Promise.all([
    getProfile(),
    getProjects(),
    getCertificates(),
    getActivities(),
  ]);

  return (
    <HomeClient
      initialProfile={profile}
      initialProjects={projects}
      initialCertificates={certificates}
      initialActivities={activities}
    />
  );
}


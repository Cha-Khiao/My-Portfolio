import { getActivities } from '@/lib/data';
import { AllActivitiesClient } from './ActivitiesClient';

export const revalidate = 60;

export default async function AllActivitiesPage() {
  const activities = await getActivities();
  return <AllActivitiesClient initialActivities={activities} />;
}


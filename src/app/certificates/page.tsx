import { getCertificates } from '@/lib/data';
import { AllCertificatesClient } from './CertificatesClient';

export const revalidate = 60;

export default async function AllCertificatesPage() {
  const certificates = await getCertificates();
  return <AllCertificatesClient initialCertificates={certificates} />;
}


import { PrismaClient } from '../src/generated/client';
import { defaultActivities, defaultCertificates, defaultProfile, defaultProjects } from '../src/lib/initial-data';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial data...');

  // 1. Profile
  await prisma.profile.upsert({
    where: { id: 'profile' },
    update: defaultProfile,
    create: defaultProfile,
  });
  console.log('Profile seeded.');

  // 2. Projects
  for (const p of defaultProjects) {
    const { id, ...data } = p;
    await prisma.project.create({
      data: {
        ...data,
      },
    });
  }
  console.log('Projects seeded.');

  // 3. Certificates
  for (const c of defaultCertificates) {
    const { id, ...data } = c;
    await prisma.certificate.create({
      data: {
        ...data,
      },
    });
  }
  console.log('Certificates seeded.');

  // 4. Activities
  for (const a of defaultActivities) {
    const { id, images, ...data } = a;
    await prisma.activity.create({
      data: {
        ...data,
        imagesJson: JSON.stringify(images || []),
      },
    });
  }
  console.log('Activities seeded.');
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

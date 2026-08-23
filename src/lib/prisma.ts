import { PrismaClient } from '@/generated/client';

// Always instantiate fresh PrismaClient from @/generated/client
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

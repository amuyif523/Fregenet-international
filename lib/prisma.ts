import { PrismaClient } from '../prisma/generated/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { requireEnv, validateCriticalEnvOnStartup } from '@/lib/env';

validateCriticalEnvOnStartup();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Singleton initialization logic
const createPrismaClient = () =>
  new PrismaClient({
    adapter: new PrismaMariaDb(requireEnv('DATABASE_URL')),
  });

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// In non-production environments, maintain the client across HMR
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

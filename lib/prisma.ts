import { PrismaClient } from '../prisma/generated/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { requireEnv, validateCriticalEnvOnStartup } from '@/lib/env';

validateCriticalEnvOnStartup();

const adapter = new PrismaMariaDb(requireEnv('DATABASE_URL'));

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

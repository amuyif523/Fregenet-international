import { PrismaClient } from '../prisma/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { requireEnv, validateCriticalEnvOnStartup } from '@/lib/env';

validateCriticalEnvOnStartup();

const pool = new pg.Pool({ connectionString: requireEnv('DATABASE_URL') });
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

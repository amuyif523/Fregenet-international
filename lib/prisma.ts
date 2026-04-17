import { PrismaClient } from '../prisma/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { requireEnv, validateCriticalEnvOnStartup } from '@/lib/env';

validateCriticalEnvOnStartup();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Singleton initialization logic
const createPrismaClient = () => {
  const connectionString = requireEnv('DATABASE_URL');
  
  // Use the PostgreSQL adapter for Prisma
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
  });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// In non-production environments, maintain the client across HMR
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

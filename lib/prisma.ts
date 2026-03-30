import { PrismaClient } from '../prisma/generated/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

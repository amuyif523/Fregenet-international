import { PrismaClient } from './prisma/generated/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const count = await prisma.boardMember.count();
    console.log(`[HANDSHAKE SUCCESS] BoardMember count: ${count}`);
    if (count === 0) {
        console.warn('WARNING: Database is connected but table is empty. Ensure seed script was run.');
    }
  } catch (error) {
    console.error('[HANDSHAKE FAILED] Database connection failed:', error);
    process.exit(1);
  }
}

main().finally(() => prisma.$disconnect());

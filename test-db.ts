import fs from 'node:fs';

if (fs.existsSync('.env')) {
  // Try loading natively available .env
  if (process.loadEnvFile) {
      process.loadEnvFile('.env')
  }
}

async function main() {
  const { prisma } = await import('./lib/prisma');
  try {
    const count = await prisma.boardMember.count();
    console.log(`[HANDSHAKE SUCCESS] BoardMember count: ${count}`);
    if (count === 0) {
        console.warn('WARNING: Database is connected but table is empty. Ensure seed script was run.');
    }
    await prisma.$disconnect();
  } catch (error) {
    console.error('[HANDSHAKE FAILED] Database connection failed:', error);
    process.exit(1);
  }
}

main();

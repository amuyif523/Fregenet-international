import { defineConfig, env } from 'prisma/config';
import fs from 'node:fs';

// Natively load .env file in Node 20.6+ / 22+
if (fs.existsSync('.env')) {
  process.loadEnvFile('.env');
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    seed: 'npx tsx prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
import { PrismaClient } from './generated/client/index.js'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required for seeding')
}

const adapter = new PrismaMariaDb(process.env.DATABASE_URL, {
  connectTimeout: 30000,
  socketTimeout: 30000,
  allowPublicKeyRetrieval: true,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.boardMember.upsert({
    where: { name: 'Amanuel Z.' },
    update: {},
    create: {
      name: 'Amanuel Z.',
      role: 'Board Member',
      bio: 'Amanuel brings decades of experience leading non-profit technology initiatives across East Africa. His strategic vision ensures sustainable access to education for vulnerable demographics.',
      imageUrl: '',
    },
  })

  await prisma.boardMember.upsert({
    where: { name: 'Dr. Selamawit K.' },
    update: {},
    create: {
      name: 'Dr. Selamawit K.',
      role: 'Board Member',
      bio: 'Dr. Selamawit is a veteran educator and community organizer dedicated to expanding nutritional and educational programs for marginalized youth.',
      imageUrl: '',
    },
  })
}

main()
  .then(async () => {
    console.log('Seed executed successfully');
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

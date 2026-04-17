import { PrismaClient } from './generated/client/index.js'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
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

  // Chart of Accounts Seeding
  const accounts = [
    { code: '1000', name: 'Cash on Hand', balance: 0 },
    { code: '1001', name: 'Cash at Bank', balance: 0 },
    { code: '1100', name: 'In-Kind Inventory', balance: 0 },
    { code: '4000', name: 'Donation Revenue', balance: 0 },
    { code: '4001', name: 'In-Kind Revenue', balance: 0 },
    { code: '5000', name: 'School Supplies Expense', balance: 0 },
  ]

  for (const acc of accounts) {
    await prisma.erpAccount.upsert({
      where: { code: acc.code },
      update: {},
      create: {
        code: acc.code,
        name: acc.name,
        balance: acc.balance,
      },
    })
  }

  console.log('Chart of Accounts seeded successfully')
}

main()
  .then(async () => {
    console.log('Seed executed successfully')
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

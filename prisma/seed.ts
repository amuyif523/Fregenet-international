import { prisma } from '../lib/prisma'

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

  // Create a sample student with health history, attendance, and nutrition records
  const studentId = 'seed-student-1'
  await prisma.student.upsert({
    where: { id: studentId },
    update: {},
    create: {
      id: studentId,
      firstName: 'Test',
      lastName: 'Student',
      dateOfBirth: new Date('2015-01-01'),
      gender: 'Female',
      school: 'Denbi',
    },
  })

  // Seed 6 health records (one per month) to ensure HealthGrowthChart has data
  const now = new Date();
  const healthSamples = [
    { height: 120.5, weight: 25.3 },
    { height: 122.1, weight: 26.0 },
    { height: 123.6, weight: 26.8 },
    { height: 125.0, weight: 27.4 },
    { height: 126.4, weight: 28.1 },
    { height: 127.8, weight: 29.0 },
  ]

  for (let i = 0; i < healthSamples.length; i++) {
    const sampleDate = new Date(now);
    sampleDate.setMonth(now.getMonth() - (healthSamples.length - 1 - i));
    // create if not exists - use a composite uniqueness approach by date+studentId isn't enforced, so skip checks
    await prisma.healthRecord.create({
      data: {
        date: sampleDate,
        height: healthSamples[i].height,
        weight: healthSamples[i].weight,
        bmi: undefined,
        studentId,
      },
    })
  }

  // Seed attendance for the last 7 days
  for (let d = 0; d < 7; d++) {
    const attendDate = new Date(now);
    attendDate.setDate(now.getDate() - d);
    await prisma.attendance.create({
      data: {
        date: attendDate,
        studentId,
        isPresent: d % 6 !== 0, // mark one day absent
        notes: d % 6 === 0 ? 'Absent due to illness' : undefined,
        school: 'Denbi',
      },
    })
  }

  // Seed a few NutritionRecord entries
  for (let d = 0; d < 3; d++) {
    const mealDate = new Date(now);
    mealDate.setDate(now.getDate() - d);
    await prisma.nutritionRecord.create({
      data: {
        date: mealDate,
        mealType: d === 0 ? 'Lunch' : 'Breakfast',
        menu: d === 0 ? 'Injera and shiro' : 'Bread and tea',
        studentCount: 120 - d,
        school: 'Denbi',
        absenteeIds: [],
      },
    })
  }
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

import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const adapter = new PrismaNeon({
  connectionString: process.env.DIRECT_URL!
})

const db = new PrismaClient({ adapter })

async function main() {
  const companies = [
    {
      name: 'Google',
      type: 'Product',
      ctc: 45.0,
      minCgpa: 7.5,
      date: '2025-08-15',
      branches: ['CSE', 'IT', 'ECE'],
      rounds: ['Aptitude', 'Technical', 'HR'],
    },
    {
      name: 'Microsoft',
      type: 'Product',
      ctc: 42.0,
      minCgpa: 7.0,
      date: '2025-08-20',
      branches: ['CSE', 'IT'],
      rounds: ['Coding', 'Technical', 'HR'],
    },
    {
      name: 'Amazon',
      type: 'Product',
      ctc: 38.0,
      minCgpa: 6.5,
      date: '2025-09-01',
      branches: ['CSE', 'IT', 'ECE', 'ME'],
      rounds: ['Aptitude', 'Coding', 'Technical', 'HR'],
    },
    {
      name: 'TCS',
      type: 'Service',
      ctc: 7.0,
      minCgpa: 6.0,
      date: '2025-07-30',
      branches: ['CSE', 'IT', 'ECE', 'ME', 'CE'],
      rounds: ['Aptitude', 'Technical', 'HR'],
    },
    {
      name: 'Infosys',
      type: 'Service',
      ctc: 6.5,
      minCgpa: 6.0,
      date: '2025-08-05',
      branches: ['CSE', 'IT', 'ECE'],
      rounds: ['Aptitude', 'HR'],
    },
    {
      name: 'Razorpay',
      type: 'Startup',
      ctc: 25.0,
      minCgpa: 7.0,
      date: '2025-09-10',
      branches: ['CSE', 'IT'],
      rounds: ['Coding', 'Technical', 'HR'],
    },
  ]

  for (const company of companies) {
    await db.company.upsert({
      where: { id: company.name },
      update: {},
      create: company,
    })
  }

  console.log('✅ Companies seeded!')
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
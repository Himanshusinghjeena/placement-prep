import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const adapter = new PrismaNeon({
  connectionString: process.env.DIRECT_URL!
})
const db = new PrismaClient({ adapter })

async function getDifficulty(slug: string): Promise<string> {
  try {
    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `{ question(titleSlug: "${slug}") { difficulty } }`
      })
    })
    const data = await res.json()
    return data?.data?.question?.difficulty || 'Medium'
  } catch {
    return 'Medium'
  }
}

async function main() {
  const problems = await db.problem.findMany()
  console.log(`Total problems: ${problems.length}`)

  let updated = 0
  let failed = 0

  for (const problem of problems) {
    // URL se slug nikalo
    // https://leetcode.com/problems/two-sum/ → two-sum
    const slug = problem.leetcodeUrl
      .split('/problems/')[1]
      ?.replace('/', '')
      ?.trim()

    if (!slug) {
      failed++
      continue
    }

    const difficulty = await getDifficulty(slug)

    await db.problem.update({
      where: { id: problem.id },
      data: { difficulty }
    })

    updated++

    if (updated % 50 === 0) {
      console.log(`Updated ${updated}/${problems.length}`)
    }

    // Rate limit avoid karne ke liye wait
    await new Promise(r => setTimeout(r, 300))
  }

  console.log(`✅ Done! Updated: ${updated}, Failed: ${failed}`)
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
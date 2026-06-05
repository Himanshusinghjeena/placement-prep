import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import * as fs from 'fs'
import * as path from 'path'

const adapter = new PrismaNeon({
  connectionString: process.env.DIRECT_URL!
})

const db = new PrismaClient({ adapter })

function parseCsv(content: string) {
  const lines = content.trim().split('\n')
  lines.shift() // header remove
  return lines.map(line => {
    const parts = line.split(',')
    const url = parts[0].trim()
    const title = parts.slice(1, parts.length - 1).join(',').trim()
    return { url, title }
  }).filter(p => p.url && p.title)
}

async function main() {
  const companiesDir = '/home/himanshu-jeena/Downloads/leetcode-company-wise-problems-2022-main/companies'
  
  const files = fs.readdirSync(companiesDir).filter(f => f.endsWith('.csv'))
  
  console.log(`Found ${files.length} company files`)

  const problemMap = new Map<string, { title: string, companies: string[] }>()

  for (const file of files) {
    const companyName = file.replace('.csv', '')
    const content = fs.readFileSync(path.join(companiesDir, file), 'utf-8')
    const problems = parseCsv(content)

    for (const problem of problems) {
      if (problemMap.has(problem.url)) {
        problemMap.get(problem.url)!.companies.push(companyName)
      } else {
        problemMap.set(problem.url, {
          title: problem.title,
          companies: [companyName]
        })
      }
    }
  }

  console.log(`Total unique problems: ${problemMap.size}`)

  let count = 0
  for (const [url, data] of problemMap) {
    // difficulty URL se nikaalte hain
    const slug = url.split('/problems/')[1]?.replace('/', '') || ''
    
    await db.problem.upsert({
      where: { id: url },
      update: { companies: data.companies },
      create: {
        id: url,
        title: data.title,
        difficulty: 'Medium', // baad mein update karenge
        tags: [],
        companies: data.companies,
        leetcodeUrl: url,
      }
    })
    count++
    if (count % 100 === 0) console.log(`${count} problems seeded...`)
  }

  console.log(`✅ Done! ${count} problems seeded.`)
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const adapter = new PrismaNeon({
  connectionString: process.env.DIRECT_URL!
})

const db = new PrismaClient({ adapter })

async function main() {
  // Quantitative Quiz
  const quiz1 = await db.quiz.create({
    data: {
      title: 'Quantitative Aptitude',
      category: 'Quantitative',
      duration: 10,
    }
  })

  await db.question.createMany({
    data: [
      {
        quizId: quiz1.id,
        question: 'A train travels 360 km in 4 hours. What is its speed?',
        options: ['80 km/h', '90 km/h', '100 km/h', '120 km/h'],
        correctIndex: 1,
        explanation: '360/4 = 90 km/h'
      },
      {
        quizId: quiz1.id,
        question: 'What is 15% of 200?',
        options: ['25', '30', '35', '40'],
        correctIndex: 1,
        explanation: '15/100 * 200 = 30'
      },
      {
        quizId: quiz1.id,
        question: 'If 6 workers complete a job in 8 days, how many days will 4 workers take?',
        options: ['10', '12', '14', '16'],
        correctIndex: 1,
        explanation: '6*8/4 = 12 days'
      },
      {
        quizId: quiz1.id,
        question: 'A shopkeeper sells an item for ₹480 at 20% profit. What is the cost price?',
        options: ['₹360', '₹380', '₹400', '₹420'],
        correctIndex: 2,
        explanation: 'CP = 480/1.2 = 400'
      },
      {
        quizId: quiz1.id,
        question: 'Find the simple interest on ₹5000 at 8% per annum for 3 years.',
        options: ['₹1000', '₹1200', '₹1500', '₹1800'],
        correctIndex: 1,
        explanation: 'SI = 5000*8*3/100 = 1200'
      },
    ]
  })

  // Logical Quiz
  const quiz2 = await db.quiz.create({
    data: {
      title: 'Logical Reasoning',
      category: 'Logical',
      duration: 10,
    }
  })

  await db.question.createMany({
    data: [
      {
        quizId: quiz2.id,
        question: 'If A > B, B > C, then which is correct?',
        options: ['C > A', 'A > C', 'B > A', 'C > B'],
        correctIndex: 1,
        explanation: 'A > B > C, so A > C'
      },
      {
        quizId: quiz2.id,
        question: 'Find the next number: 2, 6, 12, 20, 30, ?',
        options: ['40', '42', '44', '46'],
        correctIndex: 1,
        explanation: 'Differences are 4,6,8,10,12 — next is 30+12=42'
      },
      {
        quizId: quiz2.id,
        question: 'If APPLE = 50, MANGO = 56, then GRAPE = ?',
        options: ['48', '50', '52', '54'],
        correctIndex: 0,
        explanation: 'Sum of position values of letters'
      },
      {
        quizId: quiz2.id,
        question: 'A is brother of B. B is sister of C. How is A related to C?',
        options: ['Sister', 'Brother', 'Cousin', 'Cannot determine'],
        correctIndex: 1,
        explanation: 'A is male, so A is brother of C'
      },
      {
        quizId: quiz2.id,
        question: 'Which is the odd one out: Cat, Dog, Rose, Cow?',
        options: ['Cat', 'Dog', 'Rose', 'Cow'],
        correctIndex: 2,
        explanation: 'Rose is a plant, others are animals'
      },
    ]
  })

  // Technical Quiz
  const quiz3 = await db.quiz.create({
    data: {
      title: 'Technical — CS Fundamentals',
      category: 'Technical',
      duration: 15,
    }
  })

  await db.question.createMany({
    data: [
      {
        quizId: quiz3.id,
        question: 'What is the time complexity of Binary Search?',
        options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
        correctIndex: 1,
        explanation: 'Binary search divides array in half each time — O(log n)'
      },
      {
        quizId: quiz3.id,
        question: 'Which data structure uses LIFO?',
        options: ['Queue', 'Stack', 'Array', 'LinkedList'],
        correctIndex: 1,
        explanation: 'Stack uses Last In First Out'
      },
      {
        quizId: quiz3.id,
        question: 'What does SQL stand for?',
        options: ['Structured Query Language', 'Simple Query Language', 'Standard Query Logic', 'System Query Language'],
        correctIndex: 0,
        explanation: 'SQL = Structured Query Language'
      },
      {
        quizId: quiz3.id,
        question: 'Which HTTP method is used to update a resource?',
        options: ['GET', 'POST', 'PUT', 'DELETE'],
        correctIndex: 2,
        explanation: 'PUT is used to update existing resources'
      },
      {
        quizId: quiz3.id,
        question: 'What is a primary key in a database?',
        options: ['A key that can be null', 'A unique identifier for each record', 'A foreign key reference', 'An index key'],
        correctIndex: 1,
        explanation: 'Primary key uniquely identifies each record'
      },
    ]
  })

  console.log('✅ Quizzes seeded!')
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
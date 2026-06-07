import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'

export default async function Home() {
  const { userId } = await auth()

  if (userId) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#0A0C10] text-white">

      {/* Navbar */}
       <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-800">
        <div>
          <span className="text-xl font-bold">PlacePrep</span>
          <span className="text-blue-500 text-xl font-bold"> 🚀</span>
        </div>
        <div className="flex items-center gap-4">
          {userId ? (
            <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Go to Dashboard →
            </Link>
          ) : (
            <>
              <Link href="/sign-in" className="text-gray-400 hover:text-white text-sm transition-colors">
                Sign In
              </Link>
              <Link href="/sign-up" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-8 py-24 max-w-4xl mx-auto">
        <div className="inline-block bg-blue-900/30 border border-blue-700/30 text-blue-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          🎓 Built for College Placement Preparation
        </div>
        <h1 className="text-5xl font-bold leading-tight mb-6">
          Your Campus Placement
          <span className="text-blue-500"> Preparation</span> Platform
        </h1>
        <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
          Practice DSA problems, attempt aptitude quizzes, track upcoming placement drives, 
          and compete with your college peers — all in one place.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/sign-up" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-lg font-medium text-lg transition-colors">
            Start Preparing Free
          </Link>
          <Link href="/dashboard" className="border border-gray-700 hover:border-gray-500 text-gray-300 px-8 py-3.5 rounded-lg font-medium text-lg transition-colors">
            View Dashboard →
          </Link>
        </div>
        <p className="text-gray-500 text-sm mt-4">No credit card required • Free for students</p>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-800 py-12 px-8">
        <div className="max-w-4xl mx-auto grid grid-cols-4 gap-8 text-center">
          {[
            { value: '1,263+', label: 'DSA Problems' },
            { value: '50+', label: 'Companies' },
            { value: '3+', label: 'Quiz Categories' },
            { value: '100%', label: 'Free for Students' },
          ].map(stat => (
            <div key={stat.label}>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-3">Everything You Need</h2>
        <p className="text-gray-400 text-center mb-12">All placement preparation tools in one platform</p>

        <div className="grid grid-cols-3 gap-6">
          {[
            {
              icon: '💻',
              title: 'DSA Practice',
              desc: '1,263+ problems from top companies like Google, Amazon, Microsoft. Filter by company and difficulty.',
              color: 'blue'
            },
            {
              icon: '🏢',
              title: 'Placement Drives',
              desc: 'Stay updated with upcoming campus recruitment drives. Register your interest and never miss an opportunity.',
              color: 'purple'
            },
            {
              icon: '📝',
              title: 'Aptitude Quizzes',
              desc: 'Timed quizzes for Quantitative, Logical, and Technical rounds. Get instant scores and explanations.',
              color: 'green'
            },
            {
              icon: '🏆',
              title: 'Leaderboard',
              desc: 'Compete with your college peers. Earn points by solving problems and taking quizzes.',
              color: 'yellow'
            },
            {
              icon: '🎯',
              title: 'Mock Interviews',
              desc: 'Practice with AI-powered mock interviews. Get real-time feedback on your answers.',
              color: 'red'
            },
            {
              icon: '📊',
              title: 'Progress Tracking',
              desc: 'Track your preparation progress. Know exactly where you stand and what to improve.',
              color: 'teal'
            },
          ].map(feature => (
            <div key={feature.title} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-600 transition-colors">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-8 py-20 bg-gray-900/50 border-y border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">How It Works</h2>
          <p className="text-gray-400 text-center mb-12">Get started in 3 simple steps</p>
          <div className="grid grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up with your college email and complete your profile with branch, year and CGPA.' },
              { step: '02', title: 'Start Practicing', desc: 'Solve DSA problems, take aptitude quizzes, and register for upcoming placement drives.' },
              { step: '03', title: 'Track & Improve', desc: 'Monitor your progress on the leaderboard and improve your weak areas before placement season.' },
            ].map(step => (
              <div key={step.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-900/50 border border-blue-700/50 flex items-center justify-center text-blue-400 font-bold text-lg mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-24 text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Ready to Crack Your Placement?</h2>
        <p className="text-gray-400 mb-8">Join your college peers and start preparing today.</p>
        <Link href="/sign-up" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-lg font-medium text-lg transition-colors inline-block">
          Get Started Free →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-8 py-6 text-center text-gray-500 text-sm">
        <p>© 2025 PlacePrep. Built for college students.</p>
      </footer>

    </div>
  )
}
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome back, {user.name || "Student"} 👋
        </h1>
        <p className="text-gray-400 mt-1">
          Your placement preparation dashboard
        </p>
      </div>

      {/* Profile Summary */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">College</p>
          <p className="text-white font-semibold mt-1">
            {user.college || "Not set"}
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Branch</p>
          <p className="text-white font-semibold mt-1">
            {user.branch || "Not set"}
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Year</p>
          <p className="text-white font-semibold mt-1">
            {user.year ? `${user.year} Year` : "Not set"}
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">CGPA</p>
          <p className="text-white font-semibold mt-1">
            {user.cgpa || "Not set"}
          </p>
        </div>
      </div>

      {/* Modules */}
      <h2 className="text-xl font-bold mb-4">Modules</h2>
      <div className="grid grid-cols-3 gap-4">
        <Link href="/problems">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 cursor-pointer hover:border-blue-500 transition-colors">
            <div className="text-3xl mb-3">💻</div>
            <h3 className="font-semibold text-white">DSA Problems</h3>
            <p className="text-gray-400 text-sm mt-1">
              Practice coding problems
            </p>
          </div>
        </Link>
        <Link href="/companies">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 cursor-pointer hover:border-blue-500 transition-colors">
            <div className="text-3xl mb-3">🏢</div>
            <h3 className="font-semibold text-white">Companies</h3>
            <p className="text-gray-400 text-sm mt-1">
              Upcoming placement drives
            </p>
          </div>
        </Link>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 cursor-pointer hover:border-blue-500 transition-colors">
          <div className="text-3xl mb-3">🎯</div>
          <h3 className="font-semibold text-white">Mock Interview</h3>
          <p className="text-gray-400 text-sm mt-1">AI powered interviews</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 cursor-pointer hover:border-blue-500 transition-colors">
          <div className="text-3xl mb-3">📝</div>
          <h3 className="font-semibold text-white">Aptitude Quiz</h3>
          <p className="text-gray-400 text-sm mt-1">Practice aptitude tests</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 cursor-pointer hover:border-blue-500 transition-colors">
          <div className="text-3xl mb-3">🏆</div>
          <h3 className="font-semibold text-white">Leaderboard</h3>
          <p className="text-gray-400 text-sm mt-1">See your college ranking</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 cursor-pointer hover:border-blue-500 transition-colors">
          <div className="text-3xl mb-3">👤</div>
          <h3 className="font-semibold text-white">My Profile</h3>
          <p className="text-gray-400 text-sm mt-1">Update your details</p>
        </div>
      </div>
    </div>
  );
}

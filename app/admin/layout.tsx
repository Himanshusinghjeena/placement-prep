import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user || user.role !== "admin") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Admin Sidebar */}
      <div className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-5 border-b border-gray-800">
          <h1 className="font-bold text-white">Admin Panel</h1>
          <p className="text-gray-400 text-xs mt-1">TPO Dashboard</p>
        </div>
        <nav className="p-3 flex-1">
          {[
            { href: "/admin", label: "📊 Overview" },
            { href: "/admin/students", label: "👥 Students" },
            { href: "/admin/companies", label: "🏢 Companies" },
            { href: "/admin/quiz", label: "📝 Quiz" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg mb-1
              text-sm text-gray-400 hover:bg-gray-800 hover:text-white
              transition-colors">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-800">
          <a
            href="/dashboard"
            className="text-gray-500 text-xs hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}

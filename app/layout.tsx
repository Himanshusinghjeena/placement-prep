import type { Metadata } from "next";
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";
import Sidebar from '@/components/Sidebar'


export const metadata: Metadata = {
  title: "Placement Prep App",
  description: "Built with Next.js + Clerk + Supabase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased flex">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <header className="flex justify-end items-center p-4 gap-4 h-16 bg-black border-b border-gray-800">
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-sm font-medium text-white hover:text-blue-400 transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Sign Up
                </button>
              </SignUpButton>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </header>
            <main className="flex-1">{children}</main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}

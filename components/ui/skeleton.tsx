import { cn } from '@/lib/utils'

// Base shimmer skeleton
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-lg bg-gray-800/60 animate-pulse',
        className
      )}
    />
  )
}

// Dashboard stats skeleton
export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#080b11] text-white p-8">
      <div className="mb-8">
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-4 w-44" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5">
            <Skeleton className="h-3 w-20 mb-3" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
      <Skeleton className="h-5 w-28 mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
            <Skeleton className="h-10 w-10 rounded-xl mb-4" />
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-3 w-44" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Problems table skeleton
export function ProblemsSkeleton() {
  return (
    <div className="min-h-screen bg-[#080b11] text-white p-8">
      <div className="mb-6">
        <Skeleton className="h-9 w-40 mb-2" />
        <Skeleton className="h-4 w-28" />
      </div>
      <div className="flex gap-3 mb-6">
        <Skeleton className="h-10 w-72 rounded-xl" />
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 w-20 rounded-xl" />)}
      </div>
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-gray-800/60">
            <Skeleton className="h-6 w-6 rounded-full shrink-0" />
            <Skeleton className="h-4 w-8 shrink-0" />
            <Skeleton className="h-4 flex-1 max-w-xs" />
            <Skeleton className="h-6 w-16 rounded-full ml-auto" />
            <div className="flex gap-1">
              <Skeleton className="h-5 w-14 rounded" />
              <Skeleton className="h-5 w-14 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Companies grid skeleton
export function CompaniesSkeleton() {
  return (
    <div className="min-h-screen bg-[#080b11] text-white p-8">
      <div className="mb-6">
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-4 w-60" />
      </div>
      <div className="flex gap-2 mb-6">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 w-20 rounded-xl" />)}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-11 w-11 rounded-xl shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-4 w-28 mb-1.5" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <div className="flex gap-2 mb-4">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-9 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Leaderboard skeleton
export function LeaderboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#080b11] text-white p-8">
      <div className="mb-8">
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-4 w-44" />
      </div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className={`border border-gray-800 rounded-2xl p-6 text-center bg-gray-900/60 ${i === 1 ? 'scale-105' : ''}`}>
            <Skeleton className="h-10 w-10 rounded-full mx-auto mb-3" />
            <Skeleton className="h-5 w-20 mx-auto mb-2" />
            <Skeleton className="h-4 w-16 mx-auto mb-3" />
            <Skeleton className="h-7 w-24 mx-auto" />
          </div>
        ))}
      </div>
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-gray-800/60">
            <Skeleton className="h-6 w-8" />
            <Skeleton className="h-9 w-9 rounded-full shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-4 w-28 mb-1.5" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Quiz cards skeleton
export function QuizSkeleton() {
  return (
    <div className="min-h-screen bg-[#080b11] text-white p-8">
      <div className="mb-8">
        <Skeleton className="h-9 w-40 mb-2" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
            <Skeleton className="h-10 w-10 rounded-xl mb-4" />
            <Skeleton className="h-6 w-36 mb-3" />
            <div className="flex gap-2 mb-5">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Study accordion skeleton
export function StudySkeleton() {
  return (
    <div className="min-h-screen bg-[#080b11] text-white p-8">
      <div className="mb-8">
        <Skeleton className="h-9 w-44 mb-2" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="flex gap-2 border-b border-gray-800 mb-8">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-44 rounded-t-xl" />
        ))}
      </div>
      <div className="max-w-3xl flex flex-col gap-3">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <Skeleton className="h-4 w-5" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-4 w-4 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentSession } from '@/lib/server/auth/session'
import { getUserStats } from './actions'
import ProfileClient from '@/components/layout/profile'

export const metadata: Metadata = {
  title: 'Profile | Loqano',
  description: 'View your gaming profile, stats, and history',
}

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await getCurrentSession()

  if (!user) {
    redirect('/login')
  }

  const statsResult = await getUserStats()

  if ('error' in statsResult) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-red-500">
          Failed to load profile. Please try again later.
        </div>
      </div>
    )
  }

  return (
    <>
      <ProfileClient
        user={user}
        stats={statsResult.stats}
      />
      {children}
    </>
  )
}

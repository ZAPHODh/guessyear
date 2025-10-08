import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentSession } from '@/lib/server/auth/session'
import { getUserProfile, getUserStats } from './actions'
import ProfileClient from './profile-client'

export const metadata: Metadata = {
  title: 'Profile | Loqano',
  description: 'View your gaming profile, stats, and history',
}

export default async function ProfilePage() {
  const { user: sessionUser } = await getCurrentSession()

  if (!sessionUser) {
    redirect('/login')
  }

  const [profileResult, statsResult] = await Promise.all([
    getUserProfile(),
    getUserStats(),
  ])

  if ('error' in profileResult || 'error' in statsResult) {
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
        user={profileResult.user}
        stats={statsResult.stats}
      />
      <div className="container mx-auto px-6 pb-6 max-w-7xl">
        <div className="text-center text-muted-foreground py-12">
          <p className="text-lg font-semibold mb-2">Welcome to your profile!</p>
          <p className="text-sm">
            Use the navigation above to view your lobby games and daily challenge history.
          </p>
        </div>
      </div>
    </>
  )
}

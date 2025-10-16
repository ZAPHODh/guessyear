import { getScopedI18n } from '@/locales/server'

export default async function ProfileOverview() {
  const profileT = await getScopedI18n('profile')

  return (
    <div className="container mx-auto px-4 sm:px-6 pb-6 max-w-7xl">
      <div className="text-center text-muted-foreground py-12">
        <p className="text-lg font-semibold mb-2">{profileT('welcome')}</p>
        <p className="text-sm">
          {profileT('navigationHint')}
        </p>
      </div>
    </div>
  )
}

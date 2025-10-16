
import { getCurrentSession } from '@/lib/server/auth/session';
import { redirect } from 'next/navigation';
import { getScopedI18n } from '@/locales/server';
import { LobbyBrowser } from '@/components/lobby/lobby-browser';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { getLobbies } from './actions';


export default async function LobbyPage() {
  const t = await getScopedI18n('lobby');
  const { user } = await getCurrentSession();

  if (!user) {
    redirect('/login');
  }

  const lobbiesResult = await getLobbies({});
  const lobbies = Array.isArray(lobbiesResult?.data?.lobbies)
    ? lobbiesResult.data.lobbies.map(lobby => ({
      ...lobby,
      createdAt: lobby.createdAt.toISOString()
    }))
    : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-start mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-4">
          {t('title')}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          {t('pageDescription')}
        </p>
      </div>

      <div className="flex flex-row gap-4 mb-8 justify-start">
        <Link href="/lobby/new">
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            {t('createLobby')}
          </Button>
        </Link>

        <Button variant='outline' size="lg">
          {t('quickMatch')}
        </Button>
      </div>


      <LobbyBrowser user={user} initialLobbies={lobbies} />

    </div>
  );
}



import { getCurrentSession } from '@/lib/server/auth/session';
import { redirect } from 'next/navigation';
import { LobbyBrowser } from '@/components/lobby/lobby-browser';
import { Button } from '@/components/ui/button';
import { Plus, Users, Trophy, Zap } from 'lucide-react';
import Link from 'next/link';
import { getLobbies } from './actions';

export default async function LobbyPage() {
  const { user } = await getCurrentSession();

  if (!user) {
    redirect('/login');
  }

  // Fetch lobbies server-side
  const lobbiesResult = await getLobbies({});
  const lobbies = lobbiesResult?.data?.lobbies || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-4">
          Multiplayer Lobbies
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Join or create a lobby to play with friends and compete in real-time guessing games
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border rounded-lg p-6 text-center">
          <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
          <p className="text-2xl font-bold">12</p>
          <p className="text-sm text-muted-foreground">Active Lobbies</p>
        </div>
        <div className="bg-card border rounded-lg p-6 text-center">
          <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
          <p className="text-2xl font-bold">48</p>
          <p className="text-sm text-muted-foreground">Players Online</p>
        </div>
        <div className="bg-card border rounded-lg p-6 text-center">
          <Zap className="h-8 w-8 mx-auto mb-2 text-green-500" />
          <p className="text-2xl font-bold">6</p>
          <p className="text-sm text-muted-foreground">Games in Progress</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
        <Link href="/lobby/new">
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Create Lobby
          </Button>
        </Link>

        <Button variant="outline" size="lg">
          Quick Match
        </Button>
      </div>

      {/* Lobby Browser */}
      <LobbyBrowser user={user} initialLobbies={lobbies} />
    </div>
  );
}


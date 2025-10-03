"use client";

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useScopedI18n } from '@/locales/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { getLobbies } from '@/app/[locale]/(game)/lobby/actions';
import { format } from 'date-fns';
import {
  Users,
  Clock,
  Search,
  Filter,
  Play,
  Lock,
  Globe,
  Trophy,
  Zap,
  Target
} from 'lucide-react';

interface Lobby {
  id: string;
  name: string;
  description?: string | null;
  isOpen: boolean;
  maxPlayers: number;
  rounds: number;
  roundTimer: number;
  gameMode: 'CLASSIC' | 'ELIMINATION' | 'MARATHON';
  status: 'WAITING' | 'PLAYING' | 'FINISHED';
  hintsEnabled: boolean;
  targetScore?: number | null;
  host: {
    name?: string | null;
    username?: string | null;
  };
  _count: {
    players: number;
  };
  createdAt: string;
}

interface LobbyBrowserProps {
  user: any;
  initialLobbies: Lobby[];
}

export function LobbyBrowser({ user, initialLobbies }: LobbyBrowserProps) {
  const t = useScopedI18n('lobby');
  const [lobbies, setLobbies] = useState<Lobby[]>(initialLobbies);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const fetchLobbies = async () => {
    startTransition(async () => {
      try {
        const result = await getLobbies({});
        if (result?.data?.lobbies && Array.isArray(result.data.lobbies)) {
          const formattedLobbies = result.data.lobbies.map(lobby => ({
            ...lobby,
            createdAt: lobby.createdAt.toISOString()
          }));
          setLobbies(formattedLobbies);
        } else if (result?.serverError) {
          toast.error(t('browser.loading'));
        }
      } catch (error) {
        console.error('Error fetching lobbies:', error);
        toast.error(t('browser.loading'));
      }
    });
  };

  const joinLobby = async (lobbyId: string) => {
    try {
      router.push(`/lobby/${lobbyId}`);
    } catch (error) {
      console.error('Error joining lobby:', error);
      toast.error(t('errors.connectionFailed'));
    }
  };

  const filteredLobbies = lobbies.filter(lobby => {
    const matchesSearch = lobby.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lobby.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lobby.host.name?.toLowerCase().includes(searchTerm.toLowerCase());

    switch (filter) {
      case 'waiting':
        return matchesSearch && lobby.status === 'WAITING';
      case 'playing':
        return matchesSearch && lobby.status === 'PLAYING';
      case 'public':
        return matchesSearch && lobby.isOpen;
      default:
        return matchesSearch;
    }
  });

  const getGameModeIcon = (mode: string) => {
    switch (mode) {
      case 'ELIMINATION':
        return <Zap className="h-4 w-4" />;
      case 'MARATHON':
        return <Target className="h-4 w-4" />;
      default:
        return <Trophy className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'WAITING':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'PLAYING':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('browser.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs value={filter} onValueChange={setFilter} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-4 w-full sm:w-auto">
            <TabsTrigger value="all">{t('browser.filters.all')}</TabsTrigger>
            <TabsTrigger value="waiting">{t('browser.filters.waiting')}</TabsTrigger>
            <TabsTrigger value="playing">{t('browser.filters.playing')}</TabsTrigger>
            <TabsTrigger value="public">{t('browser.filters.public')}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-4">
        {filteredLobbies.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-muted-foreground">
                {searchTerm || filter !== 'all' ? t('browser.noLobbiesFiltered') : t('browser.noLobbies')}
              </div>
              <Button
                variant="outline"
                onClick={fetchLobbies}
                disabled={isPending}
                className="mt-4"
              >
                {isPending ? t('browser.loading') : t('browser.refresh')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredLobbies.map((lobby) => (
            <Card key={lobby.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {lobby.isOpen ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                      {lobby.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {t('browser.hostBy', { name: lobby.host.name || t('browser.hostAnonymous') })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(lobby.status)}>
                      {t(`lobby.status.${lobby.status?.toLowerCase()}` as any)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {lobby.description && (
                  <p className="text-sm text-muted-foreground">
                    {lobby.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {lobby._count.players}/{lobby.maxPlayers}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {t('lobby.roundTimer', { seconds: lobby.roundTimer })}
                  </div>
                  <div className="flex items-center gap-1">
                    {getGameModeIcon(lobby.gameMode)}
                    {t(`lobby.gameMode.${lobby.gameMode?.toLowerCase()}` as any)}
                    {lobby.gameMode === 'CLASSIC' && ` (${t('lobby.rounds', { count: lobby.rounds })})`}
                    {lobby.gameMode === 'MARATHON' && ` (${t('lobby.targetScore', { score: lobby.targetScore })})`}
                  </div>
                  {lobby.hintsEnabled && (
                    <Badge variant="secondary" className="text-xs">
                      {t('lobby.hintsEnabled')}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {t('browser.createdDate', { date: format(new Date(lobby.createdAt), 'MMM d, yyyy') })}
                  </span>
                  <Button
                    onClick={() => joinLobby(lobby.id)}
                    disabled={
                      lobby._count.players >= lobby.maxPlayers ||
                      lobby.status === 'FINISHED'
                    }
                    size="sm"
                    className="gap-2"
                  >
                    <Play className="h-4 w-4" />
                    {lobby.status === 'WAITING' ? t('lobby.actions.join') : t('lobby.actions.spectate')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
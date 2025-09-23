"use client";

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { getLobbies } from '@/app/[locale]/(game)/lobby/actions';
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
  description?: string;
  isOpen: boolean;
  maxPlayers: number;
  rounds: number;
  roundTimer: number;
  gameMode: 'CLASSIC' | 'ELIMINATION' | 'MARATHON';
  status: 'WAITING' | 'PLAYING' | 'FINISHED';
  hintsEnabled: boolean;
  targetScore?: number;
  host: {
    name?: string;
    username?: string;
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
  const [lobbies, setLobbies] = useState<Lobby[]>(initialLobbies);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const fetchLobbies = async () => {
    startTransition(async () => {
      try {
        const result = await getLobbies({});
        if (result?.data?.lobbies) {
          setLobbies(result.data.lobbies);
        } else if (result?.serverError) {
          toast.error('Failed to load lobbies');
        }
      } catch (error) {
        console.error('Error fetching lobbies:', error);
        toast.error('Failed to load lobbies');
      }
    });
  };

  const joinLobby = async (lobbyId: string) => {
    try {
      router.push(`/lobby/${lobbyId}`);
    } catch (error) {
      console.error('Error joining lobby:', error);
      toast.error('Failed to join lobby');
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
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search lobbies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs value={filter} onValueChange={setFilter} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-4 w-full sm:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="waiting">Waiting</TabsTrigger>
            <TabsTrigger value="playing">Playing</TabsTrigger>
            <TabsTrigger value="public">Public</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Lobby List */}
      <div className="space-y-4">
        {filteredLobbies.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-muted-foreground">
                {searchTerm || filter !== 'all' ? 'No lobbies found matching your criteria' : 'No active lobbies'}
              </div>
              <Button
                variant="outline"
                onClick={fetchLobbies}
                disabled={isPending}
                className="mt-4"
              >
                {isPending ? 'Loading...' : 'Refresh'}
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
                      Host: {lobby.host.name || 'Anonymous'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(lobby.status)}>
                      {lobby.status.toLowerCase()}
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
                    {lobby.roundTimer}s per round
                  </div>
                  <div className="flex items-center gap-1">
                    {getGameModeIcon(lobby.gameMode)}
                    {lobby.gameMode?.toLowerCase()}
                    {lobby.gameMode === 'CLASSIC' && ` (${lobby.rounds} rounds)`}
                    {lobby.gameMode === 'MARATHON' && ` (${lobby.targetScore} pts)`}
                  </div>
                  {lobby.hintsEnabled && (
                    <Badge variant="secondary" className="text-xs">
                      Hints enabled
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Created {new Date(lobby.createdAt).toLocaleDateString()}
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
                    {lobby.status === 'WAITING' ? 'Join' : 'Spectate'}
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
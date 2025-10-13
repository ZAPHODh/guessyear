"use client";

import { useState, useEffect } from 'react';
import { useScopedI18n } from '@/locales/client';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Settings } from 'lucide-react';
import type { Lobby, LobbyUpdateSettings } from '@/lib/types/lobby';

interface GameSettingsDrawerProps {
  lobby: Lobby;
  onUpdateSettings: (settings: LobbyUpdateSettings) => void;
}

export function GameSettingsDrawer({ lobby, onUpdateSettings }: GameSettingsDrawerProps) {
  const t = useScopedI18n('lobby');
  const [open, setOpen] = useState(false);
  const [gameMode, setGameMode] = useState<'CLASSIC' | 'ELIMINATION' | 'MARATHON'>(lobby.gameMode);
  const [roundTimer, setRoundTimer] = useState(lobby.roundTimer.toString());
  const [rounds, setRounds] = useState(lobby.rounds.toString());
  const [hintsEnabled, setHintsEnabled] = useState(lobby.hintsEnabled);
  const [maxPlayers, setMaxPlayers] = useState(lobby.maxPlayers.toString());

  useEffect(() => {
    setGameMode(lobby.gameMode);
    setRoundTimer(lobby.roundTimer.toString());
    setRounds(lobby.rounds.toString());
    setHintsEnabled(lobby.hintsEnabled);
    setMaxPlayers(lobby.maxPlayers.toString());
  }, [lobby]);

  const handleUpdateSettings = () => {
    onUpdateSettings({
      gameMode,
      roundTimer: parseInt(roundTimer),
      rounds: parseInt(rounds),
      hintsEnabled,
      maxPlayers: parseInt(maxPlayers)
    });
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          {t('room.settings')}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="text-center">
            <DrawerTitle>
              {t('room.gameSettings.title')}
            </DrawerTitle>
          </DrawerHeader>
          <div className="p-4 pb-6">
            <div className="flex-col gap-6 mb-6">
              <div>
                <label className="text-sm font-medium">{t('room.gameSettings.gameMode')}</label>
                <Select value={gameMode} onValueChange={(value) => setGameMode(value as 'CLASSIC' | 'ELIMINATION' | 'MARATHON')}>
                  <SelectTrigger className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLASSIC">{t('lobby.gameMode.classic')}</SelectItem>
                    <SelectItem value="ELIMINATION">{t('lobby.gameMode.elimination')}</SelectItem>
                    <SelectItem value="MARATHON">{t('lobby.gameMode.marathon')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">{t('room.gameSettings.maxPlayers')}</label>
                <Select value={maxPlayers} onValueChange={setMaxPlayers}>
                  <SelectTrigger className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">{t('room.gameSettings.options.players2')}</SelectItem>
                    <SelectItem value="4">{t('room.gameSettings.options.players4')}</SelectItem>
                    <SelectItem value="6">{t('room.gameSettings.options.players6')}</SelectItem>
                    <SelectItem value="8">{t('room.gameSettings.options.players8')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">{t('room.gameSettings.roundTimer')}</label>
                <Select value={roundTimer} onValueChange={setRoundTimer}>
                  <SelectTrigger className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">{t('room.gameSettings.options.timer30')}</SelectItem>
                    <SelectItem value="60">{t('room.gameSettings.options.timer60')}</SelectItem>
                    <SelectItem value="90">{t('room.gameSettings.options.timer90')}</SelectItem>
                    <SelectItem value="120">{t('room.gameSettings.options.timer120')}</SelectItem>
                    <SelectItem value="180">{t('room.gameSettings.options.timer180')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">{t('room.gameSettings.rounds')}</label>
                <Select value={rounds} onValueChange={setRounds}>
                  <SelectTrigger className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">{t('room.gameSettings.options.rounds3')}</SelectItem>
                    <SelectItem value="5">{t('room.gameSettings.options.rounds5')}</SelectItem>
                    <SelectItem value="8">{t('room.gameSettings.options.rounds8')}</SelectItem>
                    <SelectItem value="10">{t('room.gameSettings.options.rounds10')}</SelectItem>
                    <SelectItem value="15">{t('room.gameSettings.options.rounds15')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <label className="text-sm font-medium">{t('room.gameSettings.hintsEnabled')}</label>
              <Button
                variant={hintsEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => setHintsEnabled(!hintsEnabled)}
              >
                {hintsEnabled ? t('room.gameSettings.on') : t('room.gameSettings.off')}
              </Button>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
                {t('room.gameSettings.cancel')}
              </Button>
              <Button onClick={handleUpdateSettings} className="flex-1">
                {t('room.gameSettings.updateSettings')}
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

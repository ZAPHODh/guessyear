"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useScopedI18n } from '@/locales/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Users, Clock, Target, Settings } from 'lucide-react';
import { createLobby } from '@/app/[locale]/(game)/lobby/actions';
import { useRouter } from 'next/navigation';

const lobbyFormSchema = z.object({
  name: z.string().min(1, 'Lobby name is required').max(50, 'Name must be 50 characters or less'),
  description: z.string().max(200, 'Description must be 200 characters or less').optional(),
  maxPlayers: z.number().min(2).max(8),
  rounds: z.number().min(3).max(15),
  roundTimer: z.number().min(30).max(120),
  gameMode: z.enum(['CLASSIC', 'ELIMINATION', 'MARATHON']),
  isOpen: z.boolean(),
  hintsEnabled: z.boolean(),
  targetScore: z.number().min(100).max(2000).optional(),
});

type LobbyFormData = z.infer<typeof lobbyFormSchema>;

interface CreateLobbyDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateLobbyDialog({ children, open, onOpenChange }: CreateLobbyDialogProps) {
  const t = useScopedI18n('lobby');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<LobbyFormData>({
    resolver: zodResolver(lobbyFormSchema),
    defaultValues: {
      name: '',
      description: '',
      maxPlayers: 4,
      rounds: 5,
      roundTimer: 60,
      gameMode: 'CLASSIC',
      isOpen: true,
      hintsEnabled: false,
      targetScore: 500,
    },
  });

  const onSubmit = async (data: LobbyFormData) => {
    setIsLoading(true);
    try {
      const result = await createLobby(data);
      if (result?.data?.success && result?.data?.lobby) {
        toast.success(t('create.success'));
        router.push(`/lobby/${result.data.lobby.id}`);
      } else {
        toast.error(t('create.failed'));
      }
    } catch (error) {
      console.error('Error creating lobby:', error);
      toast.error(t('create.failed'));
    } finally {
      setIsLoading(false);
    }
  };


  const content = (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          {t('create.title')}
        </DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('create.lobbyName')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('create.lobbyNamePlaceholder')}
                      maxLength={50}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('create.description')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('create.descriptionPlaceholder')}
                      maxLength={200}
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('create.gameSettings')}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="maxPlayers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {t('create.maxPlayers')}
                    </FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[2, 3, 4, 5, 6, 7, 8].map(num => (
                          <SelectItem key={num} value={num.toString()}>
                            {t('create.playersCount', { count: num })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roundTimer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {t('create.roundTimer')}
                    </FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[30, 45, 60, 90, 120].map(seconds => (
                          <SelectItem key={seconds} value={seconds.toString()}>
                            {seconds}s
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="gameMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('create.gameMode')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='min-h-[50px] min-w-[250px]'>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CLASSIC">
                        <div>
                          <div className="font-medium">{t('lobby.gameMode.classic')}</div>
                          <div className="text-sm text-muted-foreground">{t('create.gameModes.classicDescription')}</div>
                        </div>
                      </SelectItem>
                      <SelectItem value="ELIMINATION">
                        <div>
                          <div className="font-medium">{t('lobby.gameMode.elimination')}</div>
                          <div className="text-sm text-muted-foreground">{t('create.gameModes.eliminationDescription')}</div>
                        </div>
                      </SelectItem>
                      <SelectItem value="MARATHON">
                        <div>
                          <div className="font-medium">{t('lobby.gameMode.marathon')}</div>
                          <div className="text-sm text-muted-foreground">{t('create.gameModes.marathonDescription')}</div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch('gameMode') === 'CLASSIC' && (
              <FormField
                control={form.control}
                name="rounds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      {t('create.numberOfRounds')}
                    </FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[3, 5, 7, 10, 15].map(num => (
                          <SelectItem key={num} value={num.toString()}>
                            {t('create.roundsCount', { count: num })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {form.watch('gameMode') === 'MARATHON' && (
              <FormField
                control={form.control}
                name="targetScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('create.targetScore')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={100}
                        max={2000}
                        step={50}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 500)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Advanced Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('create.advancedOptions')}</h3>

            <FormField
              control={form.control}
              name="isOpen"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between space-y-0">
                  <div>
                    <FormLabel>{t('create.publicLobby')}</FormLabel>
                    <FormDescription>
                      {t('create.publicLobbyDescription')}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hintsEnabled"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between space-y-0">
                  <div>
                    <FormLabel>{t('create.enableHints')}</FormLabel>
                    <FormDescription>
                      {t('create.enableHintsDescription')}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange?.(false)}
              className="flex-1"
            >
              {t('create.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? t('create.creating') : t('create.createButton')}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );

  if (children) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  // Modal mode without trigger
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {content}
      </DialogContent>
    </Dialog>
  );
}
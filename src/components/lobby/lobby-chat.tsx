"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { useScopedI18n } from '@/locales/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Send, Smile, ArrowDown, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import type { ChatMessage, Guess, Player } from '@/lib/types/lobby';

interface LobbyChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string, type?: 'CHAT' | 'QUICK_PHRASE') => void;
  currentUsername: string;
  compact?: boolean;
  lastRoundResults?: {
    correctYear: number;
    guesses: Guess[];
  } | null;
  gameFinished?: boolean;
  leaderboard?: Player[];
}

const EMOJIS = [
  '😂', '😍', '🤔', '😭', '🔥', '❤️', '👏', '🙈',
  '🎉', '💪', '🎯', '😱', '😎', '😅', '👍', '👎',
  '🤷‍♂️', '🤦‍♂️', '😤', '🥳', '🤯', '😴', '🙄', '🤨'
];

export function LobbyChat({ messages, onSendMessage, currentUsername, compact = false, lastRoundResults, gameFinished = false, leaderboard = [] }: LobbyChatProps) {
  const t = useScopedI18n('lobby');
  const [message, setMessage] = useState('');
  const [showEmojiPopover, setShowEmojiPopover] = useState(false);
  const [isScrollPaused, setIsScrollPaused] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const isUserScrollingRef = useRef(false);

  const QUICK_PHRASES = [
    t('chat.quickPhrasesList.0'),
    t('chat.quickPhrasesList.1'),
    t('chat.quickPhrasesList.2'),
    t('chat.quickPhrasesList.3'),
    t('chat.quickPhrasesList.4'),
    t('chat.quickPhrasesList.5'),
    t('chat.quickPhrasesList.6'),
    t('chat.quickPhrasesList.7')
  ];

  // Deduplicate messages to prevent React key conflicts
  const uniqueMessages = messages.filter((message, index, self) =>
    index === self.findIndex(m => m.id === message.id)
  );

  // Detect user scroll
  const handleScroll = useCallback(() => {
    if (!scrollAreaRef.current) return;

    const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
    if (!scrollElement) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollElement;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;

    if (!isAtBottom && !isUserScrollingRef.current) {
      isUserScrollingRef.current = true;
      setIsScrollPaused(true);
    }

    if (isAtBottom && isUserScrollingRef.current) {
      isUserScrollingRef.current = false;
      setIsScrollPaused(false);
    }
  }, []);

  // Attach scroll listener
  useEffect(() => {
    const scrollElement = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current && !isScrollPaused) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [uniqueMessages, isScrollPaused]);

  // Resume scrolling
  const resumeScrolling = useCallback(() => {
    if (!scrollAreaRef.current) return;

    const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollElement) {
      scrollElement.scrollTo({
        top: scrollElement.scrollHeight,
        behavior: 'smooth'
      });
      isUserScrollingRef.current = false;
      setIsScrollPaused(false);
    }
  }, []);

  const handleSendMessage = useDebouncedCallback(() => {
    if (!message.trim()) return;
    onSendMessage(message.trim());
    setMessage('');
  }, 300);

  const handleSendQuickPhrase = (phrase: string) => {
    onSendMessage(phrase, 'QUICK_PHRASE');
    setShowEmojiPopover(false);
  };

  const handleSendEmoji = (emoji: string) => {
    onSendMessage(emoji, 'QUICK_PHRASE');
    setShowEmojiPopover(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'HH:mm');
  };

  return (
    <div className={`${compact ? 'h-[400px]' : 'h-[500px]'} flex flex-col bg-background border rounded-lg overflow-hidden relative`}>
      <div className="pb-2 px-3 pt-2 border-b bg-muted/30">
        <h3 className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
          {t('chat.title')}
        </h3>
      </div>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Game Finished Results - Fixed at top */}
        {gameFinished && leaderboard.length > 0 && (
          <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-b backdrop-blur-sm">
            <Accordion type="single" collapsible defaultValue="game-results">
              <AccordionItem value="game-results" className="border-none">
                <AccordionTrigger className="px-3 py-2 hover:no-underline text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="text-yellow-700 dark:text-yellow-400">🎉 Game Finished!</span>
                    <Badge variant="default" className="ml-auto text-[10px] px-1.5 py-0 bg-yellow-500">
                      Winner
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-3 max-h-[200px] overflow-y-auto">
                  <div className="space-y-2">
                    {leaderboard.map((player, index) => (
                      <div
                        key={player.id}
                        className={`flex items-center justify-between text-xs py-2 px-2.5 rounded ${
                          index === 0
                            ? 'bg-yellow-500/20 border border-yellow-500/30'
                            : 'bg-muted/40'
                        }`}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className={`font-bold ${index === 0 ? 'text-yellow-700 dark:text-yellow-400' : 'text-muted-foreground'}`}>
                            #{index + 1}
                          </span>
                          <span className={`font-medium truncate ${index === 0 ? 'font-bold' : ''}`}>
                            {player.username}
                            {index === 0 && ' 👑'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {player.streak > 1 && (
                            <Badge variant="outline" className="text-[10px] px-1 py-0">
                              {player.streak}x streak
                            </Badge>
                          )}
                          <span className={`font-bold ${index === 0 ? 'text-yellow-600 dark:text-yellow-500 text-sm' : 'text-primary'}`}>
                            {player.score} pts
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}

        {/* Past Guesses Accordion Banner - Fixed at top, always visible during game */}
        {!gameFinished && (
          <div className="absolute top-0 left-0 right-0 z-20 bg-background/95 border-b backdrop-blur-sm">
            <Accordion type="single" collapsible>
              <AccordionItem value="guesses" className="border-none">
                <AccordionTrigger className="px-3 py-2 hover:no-underline text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-3.5 w-3.5 text-yellow-500" />
                    <span>{t('chat.lastRoundResultsTitle')}</span>
                    {lastRoundResults && lastRoundResults.guesses && lastRoundResults.guesses.length > 0 && (
                      <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0">
                        {lastRoundResults.guesses.length}
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-2 max-h-[200px] overflow-y-auto">
                  {lastRoundResults && lastRoundResults.guesses && lastRoundResults.guesses.length > 0 ? (
                    <div className="space-y-1.5">
                      <div className="text-xs text-muted-foreground mb-2">
                        Correct year: <span className="font-bold text-foreground">{lastRoundResults.correctYear}</span>
                      </div>
                      {lastRoundResults.guesses
                        .sort((a, b) => b.points - a.points)
                        .map((guess, index) => (
                          <div
                            key={`${guess.player}-${index}`}
                            className="flex items-center justify-between text-xs py-1.5 px-2 rounded bg-muted/40"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="font-medium truncate">{guess.player}</span>
                              <Badge variant="outline" className="text-[10px] px-1 py-0">
                                {guess.year}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-muted-foreground">
                                {Math.abs(guess.year - lastRoundResults.correctYear)} off
                              </span>
                              <span className="font-bold text-primary">
                                +{guess.points}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground text-center py-3">
                      <p className="mb-1">{t('chat.noResultsYet')}</p>
                      <p className="text-[10px]">{t('chat.noResultsDescription')}</p>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}

        {/* Messages Area */}
        <ScrollArea className="flex-1 min-h-0" ref={scrollAreaRef}>
          <div className="px-2 py-2 space-y-2">
            {uniqueMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                <p className="text-muted-foreground text-sm">{t('chat.noMessages')}</p>
                <p className="text-muted-foreground text-xs mt-1">{t('chat.startConversation')}</p>
              </div>
            ) : (
              uniqueMessages.map((msg) => {
                const isOwnMessage = msg.username === currentUsername;
                const isSystemMessage = msg.type === 'SYSTEM';

                if (isSystemMessage) {
                  return (
                    <div key={msg.id} className="flex justify-center py-1">
                      <div className="bg-muted/50 rounded-full px-3 py-1 text-xs text-muted-foreground">
                        {msg.message}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={msg.id} className="group">
                    <div className="flex items-start gap-2 hover:bg-muted/30 rounded px-1.5 py-1">
                      {/* Avatar */}
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 border border-primary/20">
                        <span className="text-xs font-bold text-primary">
                          {msg.username.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Username */}
                        <div className="flex items-baseline gap-1.5">
                          <p className="text-xs font-bold text-foreground">
                            {msg.username}
                          </p>
                          {isOwnMessage && (
                            <span className="text-[10px] text-primary font-medium">(você)</span>
                          )}
                        </div>

                        {/* Message */}
                        <p className="text-xs text-foreground/70 break-words leading-relaxed">
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>

        {/* Scroll Paused Button */}
        {isScrollPaused && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10">
            <Button
              onClick={resumeScrolling}
              size="sm"
              variant="secondary"
              className="shadow-lg bg-background/95 backdrop-blur-sm border"
            >
              <ArrowDown className="h-3 w-3 mr-2" />
              {t('chat.scrollPaused')}
            </Button>
          </div>
        )}

        {/* Input Area */}
        <div className="flex items-center gap-1.5 px-2 py-2 border-t bg-muted/20">
          <Popover open={showEmojiPopover} onOpenChange={setShowEmojiPopover}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-md flex-shrink-0 hover:bg-muted"
              >
                <Smile className="h-3.5 w-3.5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-3" side="top" align="start">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Quick Phrases</h4>
                  <div className="grid grid-cols-2 gap-1">
                    {QUICK_PHRASES.map((phrase) => (
                      <Button
                        key={phrase}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSendQuickPhrase(phrase)}
                        className="text-xs h-8 justify-start"
                      >
                        {phrase}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2">Emojis</h4>
                  <div className="grid grid-cols-8 gap-1">
                    {EMOJIS.map((emoji) => (
                      <Button
                        key={emoji}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSendEmoji(emoji)}
                        className="h-8 w-8 p-0 text-base hover:scale-110 transition-transform"
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={t('chat.placeholder')}
            maxLength={200}
            className="flex-1 h-7 text-xs bg-background"
          />

          <Button
            type="button"
            onClick={handleSendMessage}
            disabled={!message.trim()}
            size="icon"
            className="h-7 w-7 rounded-md flex-shrink-0"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

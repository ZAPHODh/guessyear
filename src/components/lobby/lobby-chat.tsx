"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { useScopedI18n } from '@/locales/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Send, Smile, ArrowDown } from 'lucide-react';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import type { ChatMessage } from '@/lib/types/lobby';

interface LobbyChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string, type?: 'CHAT' | 'QUICK_PHRASE') => void;
  currentUsername: string;
  compact?: boolean;
}

const EMOJIS = [
  '😂', '😍', '🤔', '😭', '🔥', '❤️', '👏', '🙈',
  '🎉', '💪', '🎯', '😱', '😎', '😅', '👍', '👎',
  '🤷‍♂️', '🤦‍♂️', '😤', '🥳', '🤯', '😴', '🙄', '🤨'
];

export function LobbyChat({ messages, onSendMessage, currentUsername, compact = false }: LobbyChatProps) {
  const t = useScopedI18n('lobby');
  const [message, setMessage] = useState('');
  const [showEmojiPopover, setShowEmojiPopover] = useState(false);
  const [isScrollPaused, setIsScrollPaused] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const isUserScrollingRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wasFocusedRef = useRef(false);

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

  const uniqueMessages = messages.filter((message, index, self) =>
    index === self.findIndex(m => m.id === message.id)
  );

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

  useEffect(() => {
    const scrollElement = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  useEffect(() => {
    if (scrollAreaRef.current && !isScrollPaused) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [uniqueMessages, isScrollPaused]);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handleFocus = () => {
      wasFocusedRef.current = true;
    };

    const handleBlur = () => {
      wasFocusedRef.current = false;
    };

    input.addEventListener('focus', handleFocus);
    input.addEventListener('blur', handleBlur);

    if (wasFocusedRef.current && document.activeElement !== input) {
      input.focus();
    }

    return () => {
      input.removeEventListener('focus', handleFocus);
      input.removeEventListener('blur', handleBlur);
    };
  });

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

  return (
    <div className={`${compact ? 'h-[400px]' : 'h-[500px]'} flex flex-col bg-background border rounded-lg overflow-hidden relative`}>
      <div className="pb-2 px-3 pt-2 border-b bg-muted/30">
        <h3 className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
          {t('chat.title')}
        </h3>
      </div>

      <div className="flex-1 flex flex-col relative overflow-hidden">
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
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 border border-primary/20">
                        <span className="text-xs font-bold text-primary">
                          {msg.username.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-1.5">
                          <p className="text-xs font-bold text-foreground">
                            {msg.username}
                          </p>
                          {isOwnMessage && (
                            <span className="text-[10px] text-primary font-medium">(você)</span>
                          )}
                        </div>

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
            ref={inputRef}
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

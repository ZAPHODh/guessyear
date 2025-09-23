"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Send, Smile } from 'lucide-react';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  type: 'CHAT' | 'SYSTEM' | 'QUICK_PHRASE';
  createdAt: string;
}

interface LobbyChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string, type?: 'CHAT' | 'QUICK_PHRASE') => void;
  currentUsername: string;
  compact?: boolean;
}

const QUICK_PHRASES = [
  'Boa!',
  'Quase!',
  'Nossa!',
  'Muito difícil',
  'Fácil demais',
  'GG!',
  'Vamos lá!',
  'Concentra!'
];

const EMOJIS = [
  '😂', '😍', '🤔', '😭', '🔥', '❤️', '👏', '🙈',
  '🎉', '💪', '🎯', '😱', '😎', '😅', '👍', '👎',
  '🤷‍♂️', '🤦‍♂️', '😤', '🥳', '🤯', '😴', '🙄', '🤨'
];

export function LobbyChat({ messages, onSendMessage, currentUsername, compact = false }: LobbyChatProps) {
  const [message, setMessage] = useState('');
  const [showEmojiPopover, setShowEmojiPopover] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the ScrollArea to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    onSendMessage(message.trim());
    setMessage('');
  };

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
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMessageTypeStyle = (type: string) => {
    switch (type) {
      case 'SYSTEM':
        return 'text-muted-foreground italic text-center';
      case 'QUICK_PHRASE':
        return 'text-blue-600 font-medium';
      default:
        return '';
    }
  };

  return (
    <Card className={`${compact ? 'h-[400px]' : 'h-[500px]'} flex flex-col`}>
      <CardHeader className={compact ? 'pb-3 flex-shrink-0' : 'flex-shrink-0'}>
        <CardTitle className={compact ? 'text-lg' : ''}>
          Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 py-0 flex flex-col flex-1 min-h-0">
        <ScrollArea
          className="flex-1 px-4 min-h-0"
          ref={scrollAreaRef}
        >
          <div className="space-y-3 pb-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">
                <p>No messages yet</p>
                <p className="text-sm">Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isOwnMessage = msg.username === currentUsername;
                const isSystemMessage = msg.type === 'SYSTEM';

                if (isSystemMessage) {
                  return (
                    <div
                      key={msg.id}
                      className="text-center text-muted-foreground italic text-sm py-2"
                    >
                      {msg.message}
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-3`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-3 py-2 ${isOwnMessage
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted text-foreground mr-auto'
                        }`}
                    >
                      {!isOwnMessage && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-xs">
                            {msg.username}
                          </span>
                          {msg.type === 'QUICK_PHRASE' && (
                            <Badge variant="outline" className="text-xs">
                              Quick
                            </Badge>
                          )}
                        </div>
                      )}
                      <div className="text-sm break-words">
                        {msg.message}
                      </div>
                      <div className={`text-xs mt-1 ${isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                        {formatTime(msg.createdAt)}
                        {msg.type === 'QUICK_PHRASE' && isOwnMessage && (
                          <span className="ml-2">⚡</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="px-4 py-3 border-t flex-shrink-0">
          <div className="flex gap-2">
            <Popover open={showEmojiPopover} onOpenChange={setShowEmojiPopover}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-3" side="top">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Quick Phrases</h4>
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
                    <h4 className="text-sm font-medium mb-2">Emojis</h4>
                    <div className="grid grid-cols-8 gap-1">
                      {EMOJIS.map((emoji) => (
                        <Button
                          key={emoji}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSendEmoji(emoji)}
                          className="h-8 w-8 p-0 text-lg"
                        >
                          {emoji}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <div className="flex-1 flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                maxLength={200}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                size="icon"
                className="shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
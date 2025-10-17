"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { NumberTicker } from '@/components/ui/number-ticker';
import { useScopedI18n } from '@/locales/client';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownBadgeProps {
  countdown: number;
  onComplete?: () => void;
}

export function CountdownBadge({ countdown, onComplete }: CountdownBadgeProps) {
  const t = useScopedI18n('lobby');
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (countdown <= 0) {
      setShow(false);
      onComplete?.();
    }
  }, [countdown, onComplete]);

  if (!show || countdown <= 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Card className="shadow-lg border-primary">
          <CardContent className="p-4">
            <div className="text-center space-y-1">
              <p className="text-xs text-muted-foreground font-medium">
                Next round in
              </p>
              <div className="flex items-center justify-center gap-2">
                <NumberTicker
                  value={countdown}
                  className="text-3xl font-bold text-primary tabular-nums"
                  direction="down"
                  startValue={10}
                />
                <span className="text-lg text-muted-foreground">s</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

"use client";

import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';
import { useConnectionQuality } from '@/hooks/use-connection-quality';
import { useFeatureFlag } from '@/lib/feature-flags';

export function ConnectionIndicator() {
  const enableConnectionQuality = useFeatureFlag('enableConnectionQuality');
  const { ping, quality } = useConnectionQuality();

  if (!enableConnectionQuality) {
    return null;
  }

  const qualityConfig = {
    excellent: { color: 'bg-green-500', label: 'Excellent' },
    good: { color: 'bg-yellow-500', label: 'Good' },
    poor: { color: 'bg-red-500', label: 'Poor' },
    disconnected: { color: 'bg-gray-500', label: 'Disconnected' }
  };

  const config = qualityConfig[quality];

  return (
    <Badge variant="outline" className="gap-2">
      {quality === 'disconnected' ? (
        <WifiOff className="h-3 w-3" />
      ) : (
        <Wifi className="h-3 w-3" />
      )}
      <span className={`h-2 w-2 rounded-full ${config.color}`} />
      {ping !== null && <span className="text-xs">{ping}ms</span>}
    </Badge>
  );
}

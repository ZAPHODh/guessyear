"use client";

import { Status, StatusIndicator, StatusLabel } from '@/components/ui/kibo-ui/status';
import { useConnectionQuality } from '@/hooks/use-connection-quality';
import { useFeatureFlag } from '@/lib/feature-flags';
import { useScopedI18n } from '@/locales/client';

interface ConnectionIndicatorProps {
  isConnected: boolean;
  showLabel?: boolean;
}

export function ConnectionIndicator({ isConnected, showLabel = false }: ConnectionIndicatorProps) {
  const t = useScopedI18n('lobby');
  const enableConnectionQuality = useFeatureFlag('enableConnectionQuality');
  const { ping } = useConnectionQuality();

  const status = isConnected ? 'online' : 'offline';

  return (
    <div className="flex items-center gap-2">
      <Status status={status}>
        <StatusIndicator />
        {showLabel && (
          <StatusLabel className="text-xs">
            {isConnected ? t('room.connected') : t('room.disconnected')}
          </StatusLabel>
        )}
      </Status>

      {enableConnectionQuality && ping !== null && (
        <span className="text-xs text-muted-foreground">
          {ping}ms
        </span>
      )}
    </div>
  );
}

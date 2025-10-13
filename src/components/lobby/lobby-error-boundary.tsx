"use client";

import { type ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface LobbyErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Connection Error
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            We encountered an error connecting to the game lobby. This might be due to:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Network connection issues</li>
            <li>The lobby no longer exists</li>
            <li>Server maintenance</li>
          </ul>
          <div className="flex gap-3">
            <Button
              onClick={() => {
                resetErrorBoundary();
                window.location.reload();
              }}
              variant="default"
            >
              Try Again
            </Button>
            <Button
              onClick={() => {
                window.location.href = '/lobby';
              }}
              variant="outline"
            >
              Back to Lobbies
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function LobbyErrorBoundary({ children, fallback }: LobbyErrorBoundaryProps) {
  return (
    <ErrorBoundary
      FallbackComponent={fallback ? () => <>{fallback}</> : ErrorFallback}
      onError={(error, info) => {
        console.error('[LobbyErrorBoundary] Error caught:', error);
        console.error('[LobbyErrorBoundary] Error message:', error.message);
        console.error('[LobbyErrorBoundary] Error stack:', error.stack);
        console.error('[LobbyErrorBoundary] Component stack:', info.componentStack);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

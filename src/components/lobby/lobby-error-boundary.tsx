"use client";

import { Component, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface LobbyErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface LobbyErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class LobbyErrorBoundary extends Component<
  LobbyErrorBoundaryProps,
  LobbyErrorBoundaryState
> {
  constructor(props: LobbyErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): LobbyErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[LobbyErrorBoundary]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

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
                    this.setState({ hasError: false, error: null });
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

    return this.props.children;
  }
}

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  userId?: string;
  lobbyId?: string;
  sessionId?: string;
  [key: string]: unknown;
}

class Telemetry {
  private context: LogContext = {};

  setContext(context: LogContext) {
    this.context = { ...this.context, ...context };
  }

  clearContext() {
    this.context = {};
  }

  private log(level: LogLevel, message: string, data?: unknown) {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      message,
      context: this.context,
      data
    };

    if (process.env.NODE_ENV === 'development') {
      console[level === 'debug' ? 'log' : level](
        `[${timestamp}] [${level.toUpperCase()}] ${message}`,
        logData
      );
    }

    // Send to monitoring services (Sentry, LogRocket, etc)
    if (level === 'error' && typeof window !== 'undefined') {
      // window.Sentry?.captureException(data);
    }
  }

  debug(message: string, data?: unknown) {
    this.log('debug', message, data);
  }

  info(message: string, data?: unknown) {
    this.log('info', message, data);
  }

  warn(message: string, data?: unknown) {
    this.log('warn', message, data);
  }

  error(message: string, data?: unknown) {
    this.log('error', message, data);
  }

  // Performance metrics
  trackEvent(eventName: string, properties?: Record<string, unknown>) {
    this.info(`Event: ${eventName}`, properties);

    // Send to analytics
    if (typeof window !== 'undefined' && 'gtag' in window) {
      // @ts-ignore
      // window.gtag('event', eventName, properties);
    }
  }

  // Measure performance
  measurePerformance(label: string, fn: () => void) {
    const start = performance.now();
    fn();
    const duration = performance.now() - start;

    this.debug(`Performance: ${label}`, { duration: `${duration.toFixed(2)}ms` });
  }
}

export const telemetry = new Telemetry();

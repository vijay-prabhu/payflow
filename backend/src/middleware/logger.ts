type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

const LOG_LEVEL = (process.env.LOG_LEVEL || 'INFO') as LogLevel;
const LEVELS: Record<LogLevel, number> = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };

export function logger(functionName: string) {
  const log = (level: LogLevel, message: string, context?: Record<string, unknown>) => {
    if (LEVELS[level] < LEVELS[LOG_LEVEL]) return;

    const entry = {
      timestamp: new Date().toISOString(),
      level,
      function: functionName,
      message,
      ...context,
    };

    console.log(JSON.stringify(entry));
  };

  return {
    debug: (msg: string, ctx?: Record<string, unknown>) => log('DEBUG', msg, ctx),
    info: (msg: string, ctx?: Record<string, unknown>) => log('INFO', msg, ctx),
    warn: (msg: string, ctx?: Record<string, unknown>) => log('WARN', msg, ctx),
    error: (msg: string, ctx?: Record<string, unknown>) => log('ERROR', msg, ctx),
  };
}

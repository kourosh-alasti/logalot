import fs from 'node:fs';
import path from 'node:path';

import { colorize, getTimestamp } from '../utils/index.ts';

type LogLevel = 'log' | 'warn' | 'debug' | 'error' | 'info';
type LogFileType = 'csv' | 'json' | 'txt';
type MessageFunction = (options: MessageOptions) => string;

interface MessageOptions {
  timestamp: string;
  level: LogLevel;
  message: string;
  color: string;
}

interface LoggerOptions {
  colors?: { [key in LogLevel]: string };
  timestamps?: boolean;
  messages?: Partial<{ [key in LogLevel]: MessageFunction }>;
}

interface ExportOptions {
  levels?: LogLevel[];
  format?: LogFileType;
  jsonSpaces?: number;
  csvSeparator?: string;
  includeTimestamp?: boolean;
  includeLevel?: boolean;
}

class Logger {
  private logs: string[] = [];
  private colors: { [key in LogLevel]: string };
  private timestamps: boolean = true;
  private messageFunctions: { [key in LogLevel]: MessageFunction };

  constructor(options?: LoggerOptions) {
    this.colors = options?.colors || {
      log: '#00FF00', //---- GREEN
      warn: '#FFFF00', //--- YELLOW
      debug: '#0000FF', //-- BLUE
      error: '#FF0000', //-- RED
      info: '#00FFFF', //--- CYAN
    };

    this.timestamps = options?.timestamps ?? true;
    this.messageFunctions = {
      log: this.createMessage,
      warn: this.createMessage,
      debug: this.createMessage,
      error: this.createMessage,
      info: this.createMessage,
      ...options?.messages,
    };
  }

  private createMessage(options: MessageOptions): string {
    const { timestamp, level, message, color } = options;
    const coloredLevel = colorize(color, `[${level.toUpperCase()}]`);

    return `${timestamp.length > 0 ? `[${timestamp}]` : ``}${coloredLevel} ${message}`;
  }

  private displayLog(level: LogLevel | 'notification', message: string): void {
    if (level === 'notification') {
      const noti = `\n[${getTimestamp()}] [${colorize('#73FBD3', 'NOTIFICATION')}] ${message}\n`;

      process.stdout.write(noti);
      return;
    }

    const preparedMessage: string = this.messageFunctions[level]({
      timestamp: this.timestamps ? `${getTimestamp()}` : '',
      level,
      message,
      color: this.colors[level],
    });

    process.stdout.write(preparedMessage + '\n');

    const logEntry = `[${getTimestamp()}] [${level.toUpperCase()}] ${message}`;
    this.logs.push(logEntry);
  }

  log(message: string): void {
    this.displayLog('log', message);
  }

  warn(message: string): void {
    this.displayLog('warn', message);
  }

  debug(message: string): void {
    this.displayLog('debug', message);
  }

  error(message: string): void {
    this.displayLog('error', message);
  }

  info(message: string): void {
    this.displayLog('info', message);
  }

  private noti(message: string): void {
    this.displayLog('notification', message);
  }

  export(filePath: string, options: ExportOptions = {}): void {
    const {
      levels,
      format = 'txt',
      jsonSpaces = 2,
      csvSeparator = ',',
      includeTimestamp = true,
      includeLevel = true,
    } = options;

    const directory = path.dirname(filePath);

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    let filteredLogs = this.logs;
    if (levels && levels?.length > 0) {
      filteredLogs = this.logs.filter(log => {
        const logLevel: LogLevel = log
          .match(/\[([A-Z]+)\]/)?.[1]
          .toLowerCase() as LogLevel;

        return levels.includes(logLevel);
      });
    }

    let content: string;

    switch (format) {
      case 'json': {
        const jsonLogs = filteredLogs.map(log => {
          const [timestamp, level, ...messageParts] = log.split('] ');
          const message: string = messageParts.join('] ').trim();

          return {
            ...(includeTimestamp && { timestamp: timestamp.slice(1) }),
            ...(includeLevel && { level: level.slice(1).toLowerCase() }),
            message,
          };
        });

        content = JSON.stringify(jsonLogs, null, jsonSpaces);
        break;
      }
      case 'csv': {
        const csvHeaders = [
          ...(includeTimestamp ? ['Timestamp'] : []),
          ...(includeLevel ? ['Level'] : []),
          'Message',
        ];

        const csvRows = filteredLogs.map(log => {
          const [timestamp, level, ...messageParts] = log.split('] ');
          const message: string = messageParts.join('] ').trim();

          return [
            ...(includeTimestamp ? [timestamp.slice(1)] : []),
            ...(includeLevel ? [level.slice(1)] : []),
            message,
          ]
            .map(field => `"${field.replace(/"/g, '""')}`)
            .join(csvSeparator);
        });

        content = [csvHeaders.join(csvSeparator), ...csvRows].join('\n');
        break;
      }
      case 'txt':
      default: {
        content = filteredLogs.join('\n');
        break;
      }
    }

    fs.writeFileSync(filePath, content);
    this.noti(`Logs successfully exported to ${filePath}`);
  }
}

const init = (options?: LoggerOptions): Logger => {
  return new Logger({ ...options, timestamps: options?.timestamps ?? true });
};

export default init;

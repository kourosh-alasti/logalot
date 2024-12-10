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
    colors?: {
        [key in LogLevel]: string;
    };
    timestamps?: boolean;
    messages?: Partial<{
        [key in LogLevel]: MessageFunction;
    }>;
}
interface ExportOptions {
    levels?: LogLevel[];
    format?: LogFileType;
    jsonSpaces?: number;
    csvSeparator?: string;
    includeTimestamp?: boolean;
    includeLevel?: boolean;
}
declare class Logger {
    private logs;
    private colors;
    private timestamps;
    private messageFunctions;
    constructor(options?: LoggerOptions);
    private createMessage;
    private displayLog;
    log(message: string): void;
    warn(message: string): void;
    debug(message: string): void;
    error(message: string): void;
    info(message: string): void;
    private noti;
    export(filePath: string, options?: ExportOptions): void;
}
declare const createLogger: (options?: LoggerOptions) => Logger;

export { createLogger as default };

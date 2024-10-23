"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const index_ts_1 = require("../utils/index.ts");
class Logger {
    constructor(options) {
        var _a;
        this.logs = [];
        this.timestamps = true;
        this.colors = (options === null || options === void 0 ? void 0 : options.colors) || {
            log: '#00FF00',
            warn: '#FFFF00',
            debug: '#0000FF',
            error: '#FF0000',
            info: '#00FFFF',
        };
        this.timestamps = (_a = options === null || options === void 0 ? void 0 : options.timestamps) !== null && _a !== void 0 ? _a : true;
        this.messageFunctions = Object.assign({ log: this.createMessage, warn: this.createMessage, debug: this.createMessage, error: this.createMessage, info: this.createMessage }, options === null || options === void 0 ? void 0 : options.messages);
    }
    createMessage(options) {
        const { timestamp, level, message, color } = options;
        const coloredLevel = (0, index_ts_1.colorize)(color, `[${level.toUpperCase()}]`);
        return `${timestamp.length > 0 ? `[${timestamp}]` : ``}${coloredLevel} ${message}`;
    }
    displayLog(level, message) {
        if (level === 'notification') {
            const noti = `\n[${(0, index_ts_1.getTimestamp)()}] [${(0, index_ts_1.colorize)('#73FBD3', 'NOTIFICATION')}] ${message}\n`;
            process.stdout.write(noti);
            return;
        }
        const preparedMessage = this.messageFunctions[level]({
            timestamp: this.timestamps ? `${(0, index_ts_1.getTimestamp)()}` : '',
            level,
            message,
            color: this.colors[level],
        });
        process.stdout.write(preparedMessage + '\n');
        const logEntry = `[${(0, index_ts_1.getTimestamp)()}] [${level.toUpperCase()}] ${message}`;
        this.logs.push(logEntry);
    }
    log(message) {
        this.displayLog('log', message);
    }
    warn(message) {
        this.displayLog('warn', message);
    }
    debug(message) {
        this.displayLog('debug', message);
    }
    error(message) {
        this.displayLog('error', message);
    }
    info(message) {
        this.displayLog('info', message);
    }
    noti(message) {
        this.displayLog('notification', message);
    }
    export(filePath, options = {}) {
        const { levels, format = 'txt', jsonSpaces = 2, csvSeparator = ',', includeTimestamp = true, includeLevel = true, } = options;
        const directory = node_path_1.default.dirname(filePath);
        if (!node_fs_1.default.existsSync(directory)) {
            node_fs_1.default.mkdirSync(directory, { recursive: true });
        }
        let filteredLogs = this.logs;
        if (levels && (levels === null || levels === void 0 ? void 0 : levels.length) > 0) {
            filteredLogs = this.logs.filter(log => {
                var _a;
                const logLevel = (_a = log
                    .match(/\[([A-Z]+)\]/)) === null || _a === void 0 ? void 0 : _a[1].toLowerCase();
                return levels.includes(logLevel);
            });
        }
        let content;
        switch (format) {
            case 'json': {
                const jsonLogs = filteredLogs.map(log => {
                    const [timestamp, level, ...messageParts] = log.split('] ');
                    const message = messageParts.join('] ').trim();
                    return Object.assign(Object.assign(Object.assign({}, (includeTimestamp && { timestamp: timestamp.slice(1) })), (includeLevel && { level: level.slice(1).toLowerCase() })), { message });
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
                    const message = messageParts.join('] ').trim();
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
        node_fs_1.default.writeFileSync(filePath, content);
        this.noti(`Logs successfully exported to ${filePath}`);
    }
}
const init = (options) => {
    var _a;
    return new Logger(Object.assign(Object.assign({}, options), { timestamps: (_a = options === null || options === void 0 ? void 0 : options.timestamps) !== null && _a !== void 0 ? _a : true }));
};
exports.default = init;

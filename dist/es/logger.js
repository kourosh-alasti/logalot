import * as fs from 'fs';
import * as path from 'path';
import { addColorToText, getTimestamp } from './utils.js';

function _extends() {
    _extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends.apply(this, arguments);
}
class Logger {
    createMessage(options) {
        const { timestamp, level, message, color } = options;
        const coloredLevel = addColorToText(color, `[${level.toUpperCase()}]`);
        return `${timestamp.length > 0 ? `[${timestamp}]` : ``}${coloredLevel} ${message}`;
    }
    displayLog(level, message) {
        if (level === 'notification') {
            const noti = `\n[${getTimestamp()}] [${addColorToText('#73FBD3', 'NOTIFICATION')}] ${message}\n`;
            process.stdout.write(noti);
            return;
        }
        const preparedMessage = this.messageFunctions[level]({
            timestamp: this.timestamps ? `${getTimestamp()}` : '',
            level,
            message,
            color: this.colors[level]
        });
        process.stdout.write(preparedMessage + '\n');
        const logEntry = `[${getTimestamp()}] [${level.toUpperCase()}] ${message}`;
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
        const { levels, format = 'txt', jsonSpaces = 2, csvSeparator = ',', includeTimestamp = true, includeLevel = true } = options;
        const directory = path.dirname(filePath);
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, {
                recursive: true
            });
        }
        let filteredLogs = this.logs;
        if (levels && (levels == null ? void 0 : levels.length) > 0) {
            filteredLogs = this.logs.filter((log)=>{
                var _log_match;
                const logLevel = (_log_match = log.match(/\[([A-Z]+)\]/)) == null ? void 0 : _log_match[1].toLowerCase();
                return levels.includes(logLevel);
            });
        }
        let content;
        switch(format){
            case 'json':
                {
                    const jsonLogs = filteredLogs.map((log)=>{
                        const [timestamp, level, ...messageParts] = log.split('] ');
                        const message = messageParts.join('] ').trim();
                        return _extends({}, includeTimestamp && {
                            timestamp: timestamp.slice(1)
                        }, includeLevel && {
                            level: level.slice(1).toLowerCase()
                        }, {
                            message
                        });
                    });
                    content = JSON.stringify(jsonLogs, null, jsonSpaces);
                    break;
                }
            case 'csv':
                {
                    const csvHeaders = [
                        ...includeTimestamp ? [
                            'Timestamp'
                        ] : [],
                        ...includeLevel ? [
                            'Level'
                        ] : [],
                        'Message'
                    ];
                    const csvRows = filteredLogs.map((log)=>{
                        const [timestamp, level, ...messageParts] = log.split('] ');
                        const message = messageParts.join('] ').trim();
                        return [
                            ...includeTimestamp ? [
                                timestamp.slice(1)
                            ] : [],
                            ...includeLevel ? [
                                level.slice(1)
                            ] : [],
                            message
                        ].map((field)=>`"${field.replace(/"/g, '""')}`).join(csvSeparator);
                    });
                    content = [
                        csvHeaders.join(csvSeparator),
                        ...csvRows
                    ].join('\n');
                    break;
                }
            case 'txt':
            default:
                {
                    content = filteredLogs.join('\n');
                    break;
                }
        }
        fs.writeFileSync(filePath, content);
        this.noti(`Logs successfully exported to ${filePath}`);
    }
    constructor(options){
        this.logs = [];
        this.timestamps = true;
        this.colors = (options == null ? void 0 : options.colors) || {
            log: '#00FF00',
            warn: '#FFFF00',
            debug: '#0000FF',
            error: '#FF0000',
            info: '#00FFFF'
        };
        var _options_timestamps;
        this.timestamps = (_options_timestamps = options == null ? void 0 : options.timestamps) != null ? _options_timestamps : true;
        this.messageFunctions = _extends({
            log: this.createMessage,
            warn: this.createMessage,
            debug: this.createMessage,
            error: this.createMessage,
            info: this.createMessage
        }, options == null ? void 0 : options.messages);
    }
}
const createLogger = (options)=>{
    var _options_timestamps;
    return new Logger(_extends({}, options, {
        timestamps: (_options_timestamps = options == null ? void 0 : options.timestamps) != null ? _options_timestamps : true
    }));
};

export { createLogger as default };

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import * as fs from 'fs';
import * as path from 'path';
import { addColorToText, getTimestamp } from '../utils';
var Logger = /** @class */ (function () {
    function Logger(options) {
        var _a;
        this.logs = [];
        this.timestamps = true;
        this.colors = (options === null || options === void 0 ? void 0 : options.colors) || {
            log: '#00FF00', //---- GREEN
            warn: '#FFFF00', //--- YELLOW
            debug: '#0000FF', //-- BLUE
            error: '#FF0000', //-- RED
            info: '#00FFFF', //--- CYAN
        };
        this.timestamps = (_a = options === null || options === void 0 ? void 0 : options.timestamps) !== null && _a !== void 0 ? _a : true;
        this.messageFunctions = __assign({ log: this.createMessage, warn: this.createMessage, debug: this.createMessage, error: this.createMessage, info: this.createMessage }, options === null || options === void 0 ? void 0 : options.messages);
    }
    Logger.prototype.createMessage = function (options) {
        var timestamp = options.timestamp, level = options.level, message = options.message, color = options.color;
        var coloredLevel = addColorToText(color, "[".concat(level.toUpperCase(), "]"));
        return "".concat(timestamp.length > 0 ? "[".concat(timestamp, "]") : "").concat(coloredLevel, " ").concat(message);
    };
    Logger.prototype.displayLog = function (level, message) {
        if (level === 'notification') {
            var noti = "\n[".concat(getTimestamp(), "] [").concat(addColorToText('#73FBD3', 'NOTIFICATION'), "] ").concat(message, "\n");
            process.stdout.write(noti);
            return;
        }
        var preparedMessage = this.messageFunctions[level]({
            timestamp: this.timestamps ? "".concat(getTimestamp()) : '',
            level: level,
            message: message,
            color: this.colors[level],
        });
        process.stdout.write(preparedMessage + '\n');
        var logEntry = "[".concat(getTimestamp(), "] [").concat(level.toUpperCase(), "] ").concat(message);
        this.logs.push(logEntry);
    };
    Logger.prototype.log = function (message) {
        this.displayLog('log', message);
    };
    Logger.prototype.warn = function (message) {
        this.displayLog('warn', message);
    };
    Logger.prototype.debug = function (message) {
        this.displayLog('debug', message);
    };
    Logger.prototype.error = function (message) {
        this.displayLog('error', message);
    };
    Logger.prototype.info = function (message) {
        this.displayLog('info', message);
    };
    Logger.prototype.noti = function (message) {
        this.displayLog('notification', message);
    };
    Logger.prototype.export = function (filePath, options) {
        if (options === void 0) { options = {}; }
        var levels = options.levels, _a = options.format, format = _a === void 0 ? 'txt' : _a, _b = options.jsonSpaces, jsonSpaces = _b === void 0 ? 2 : _b, _c = options.csvSeparator, csvSeparator = _c === void 0 ? ',' : _c, _d = options.includeTimestamp, includeTimestamp = _d === void 0 ? true : _d, _e = options.includeLevel, includeLevel = _e === void 0 ? true : _e;
        var directory = path.dirname(filePath);
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
        var filteredLogs = this.logs;
        if (levels && (levels === null || levels === void 0 ? void 0 : levels.length) > 0) {
            filteredLogs = this.logs.filter(function (log) {
                var _a;
                var logLevel = (_a = log
                    .match(/\[([A-Z]+)\]/)) === null || _a === void 0 ? void 0 : _a[1].toLowerCase();
                return levels.includes(logLevel);
            });
        }
        var content;
        switch (format) {
            case 'json': {
                var jsonLogs = filteredLogs.map(function (log) {
                    var _a = log.split('] '), timestamp = _a[0], level = _a[1], messageParts = _a.slice(2);
                    var message = messageParts.join('] ').trim();
                    return __assign(__assign(__assign({}, (includeTimestamp && { timestamp: timestamp.slice(1) })), (includeLevel && { level: level.slice(1).toLowerCase() })), { message: message });
                });
                content = JSON.stringify(jsonLogs, null, jsonSpaces);
                break;
            }
            case 'csv': {
                var csvHeaders = __spreadArray(__spreadArray(__spreadArray([], (includeTimestamp ? ['Timestamp'] : []), true), (includeLevel ? ['Level'] : []), true), [
                    'Message',
                ], false);
                var csvRows = filteredLogs.map(function (log) {
                    var _a = log.split('] '), timestamp = _a[0], level = _a[1], messageParts = _a.slice(2);
                    var message = messageParts.join('] ').trim();
                    return __spreadArray(__spreadArray(__spreadArray([], (includeTimestamp ? [timestamp.slice(1)] : []), true), (includeLevel ? [level.slice(1)] : []), true), [
                        message,
                    ], false).map(function (field) { return "\"".concat(field.replace(/"/g, '""')); })
                        .join(csvSeparator);
                });
                content = __spreadArray([csvHeaders.join(csvSeparator)], csvRows, true).join('\n');
                break;
            }
            case 'txt':
            default: {
                content = filteredLogs.join('\n');
                break;
            }
        }
        fs.writeFileSync(filePath, content);
        this.noti("Logs successfully exported to ".concat(filePath));
    };
    return Logger;
}());
var createLogger = function (options) {
    var _a;
    return new Logger(__assign(__assign({}, options), { timestamps: (_a = options === null || options === void 0 ? void 0 : options.timestamps) !== null && _a !== void 0 ? _a : true }));
};
export default createLogger;

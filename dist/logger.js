"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logger {
    constructor(options) {
        this.colors = options.colors;
        this.timestamps = options.timestamps;
        this.messages = options.messages || {
            log: console.log,
            warn: console.warn,
            debug: console.debug,
            error: console.error,
            info: console.info,
        };
    }
    getTimestamp() {
        return this.timestamps ? `[${new Date().toISOString()}]` : "";
    }
    hexToRGB(hex) {
        const bigInt = parseInt(hex.slice(1), 16);
        const r = (bigInt >> 16) & 255;
        const g = (bigInt >> 8) & 255;
        const b = bigInt & 255;
        return `${r};${g};${b}`;
    }
    applyColor(color, message) {
        return `\x1b[38;2;${this.hexToRGB(color)}m${message}\x1b[0m`;
    }
    logMessage(level, message) {
        const coloredMessage = this.applyColor(this.colors[level], message);
        const finalMessage = `${this.getTimestamp()} [${level.toUpperCase()}] ${coloredMessage}`;
        this.messages[level](finalMessage);
    }
    log(message) {
        this.logMessage("log", message);
    }
    warn(message) {
        this.logMessage("warn", message);
    }
    debug(message) {
        this.logMessage("debug", message);
    }
    error(message) {
        this.logMessage("error", message);
    }
    info(message) {
        this.logMessage("info", message);
    }
}
const initLogger = (options) => {
    return new Logger(options);
};
exports.default = initLogger;

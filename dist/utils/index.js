"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.colorize = colorize;
exports.getTimestamp = getTimestamp;
exports.hexToRGB = hexToRGB;
function hexToRGB(hex) {
    const num = parseInt(hex.slice(1), 16);
    const redValue = (num >> 16) & 255;
    const greenValue = (num >> 8) & 255;
    const blueValue = num & 255;
    return [redValue, greenValue, blueValue];
}
function colorize(color, message) {
    const [r, g, b] = hexToRGB(color);
    return `\x1b[38;2;${r};${g};${b}m${message}\x1b[0m`;
}
function getTimestamp() {
    return new Date().toISOString();
}

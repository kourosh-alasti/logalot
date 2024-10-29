'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
exports.addColorToText = addColorToText;
exports.getTimestamp = getTimestamp;
exports.hexToRGB = hexToRGB;
function hexToRGB(hex) {
    // Convert HEX Value to Integer
    // #FFF000 --> 16773120
    var num = parseInt(hex.slice(1), 16);
    // Right Shift 16 bits with >> 16
    // Right Shift 8  bits with >> 8
    // BitWise & compare bits between lhs and rhs
    var redValue = (num >> 16) & 255;
    var greenValue = (num >> 8) & 255;
    var blueValue = num & 255;
    return [redValue, greenValue, blueValue];
}
function addColorToText(color, message) {
    var _a = hexToRGB(color), r = _a[0], g = _a[1], b = _a[2];
    return "\u001B[38;2;".concat(r, ";").concat(g, ";").concat(b, "m").concat(message, "\u001B[0m");
}
function getTimestamp() {
    return new Date().toISOString();
}

function hexToRGB(hex) {
    // Convert HEX Value to Integer
    // #FFF000 --> 16773120
    const num = parseInt(hex.slice(1), 16);
    // Right Shift 16 bits with >> 16
    // Right Shift 8  bits with >> 8
    // BitWise & compare bits between lhs and rhs
    const redValue = num >> 16 & 255;
    const greenValue = num >> 8 & 255;
    const blueValue = num & 255;
    return [
        redValue,
        greenValue,
        blueValue
    ];
}
function addColorToText(color, message) {
    const [r, g, b] = hexToRGB(color);
    return `\x1b[38;2;${r};${g};${b}m${message}\x1b[0m`;
}
function getTimestamp() {
    return new Date().toISOString();
}

exports.addColorToText = addColorToText;
exports.getTimestamp = getTimestamp;
exports.hexToRGB = hexToRGB;

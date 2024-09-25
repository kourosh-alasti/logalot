function hexToRGB(hex: string): [number, number, number] {
    const bigInt = parseInt(hex.slice(1), 16);
    const r = (bigInt >> 16) & 255;
    const g = (bigInt >> 8) & 255;
    const b = bigInt & 255;
    return [r, g, b];
  }

 function colorize(color: string, message: string): string {
    const [r, g, b] = hexToRGB(color);
    return `\x1b[38;2;${r};${g};${b}m${message}\x1b[0m`;
  }

  function getTimestamp(): string {
    return new Date().toISOString();
  }

  export { colorize, hexToRGB, getTimestamp}
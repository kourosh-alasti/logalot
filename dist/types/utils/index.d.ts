declare function hexToRGB(hex: string): [number, number, number];
declare function addColorToText(color: string, message: string): string;
declare function getTimestamp(): string;
export { addColorToText, getTimestamp, hexToRGB };

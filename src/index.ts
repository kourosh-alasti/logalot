import init from './logger/index.ts';
import { colorize } from './utils/index.ts';

const createLogger = init;
const addColorToText = colorize;

export { addColorToText, createLogger };

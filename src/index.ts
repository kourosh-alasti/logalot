import init from './logger.ts';
import { colorize } from './utils/index.ts';

const createLogger = init;
const addColor = colorize;

export { addColor, createLogger }

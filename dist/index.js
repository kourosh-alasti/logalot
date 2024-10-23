'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.createLogger = exports.addColorToText = void 0;
const index_ts_1 = __importDefault(require('./logger/index.ts'));
const index_ts_2 = require('./utils/index.ts');
const createLogger = index_ts_1.default;
exports.createLogger = createLogger;
const addColorToText = index_ts_2.colorize;
exports.addColorToText = addColorToText;

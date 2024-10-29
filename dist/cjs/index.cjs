'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = exports.addColorToText = void 0;
var logger_1 = require('./logger/index.cjs');
exports.createLogger = logger_1.default;
var utils_1 = require('./utils/index.cjs');
Object.defineProperty(exports, "addColorToText", { enumerable: true, get: function () { return utils_1.addColorToText; } });

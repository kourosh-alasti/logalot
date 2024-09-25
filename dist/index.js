"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_ts_1 = __importDefault(require("./logger.ts"));
const logger = (0, logger_ts_1.default)({
    colors: {
        log: "#ec1",
        warn: "#fff",
        debug: "#12a",
        error: "#f00",
        info: "#cf3",
    },
    timestamps: true,
});
logger.log("Log");
logger.warn("Warn");
logger.debug("Debug");
logger.debug("Error");
logger.info("Info");

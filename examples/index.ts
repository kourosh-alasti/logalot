import { createLogger, addColor } from '../src/index';

const logger = createLogger(
    {
      colors: {
        log: "#A3D1E5",
        warn: "#F1C40F",
        debug: "#E74C3C",
        error: "#9B59B6", 
        info: "#2ECC71",  
      },
      timestamps: true,
      messages: {
        log: ({ timestamp, level, message, color }) => {
          const coloredLevel = addColor(color, `[${level.toUpperCase()}]`);
          const coloredMessage = addColor("#ff00ff", message); // Purple message
          return `${coloredLevel} ${timestamp} - ${coloredMessage}`;
        } ,
        error: ({ timestamp, level, message, color }) => {
          const coloredTimestamp = addColor("#ff8800", timestamp); // Orange timestamp
          return `${coloredTimestamp} [${level.toUpperCase()}] ${message}`;
        },
      }
    }
    );
    
    logger.log("This is a log message");
    logger.warn("This is a warning");
    logger.debug("This is a debug message");
    logger.error("This is an error");
    logger.info("This is an info message");
    
    // Export logs
    logger.export('./logs/all_logs.txt');
    logger.export('./logs/errors_and_warnings.json', {
      format: 'json',
      levels: ['error', 'warn'],
      jsonSpaces: 2
    });
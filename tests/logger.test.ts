import t from "tap";
import init from '../src/logger.ts';


t.test("Default Logger", (t) => {
  const logger = init();
  
  logger.log("Log");
  logger.warn("Warn");
  logger.debug("Debug");
  logger.debug("Error");
  logger.info("Info");

  // End Tests
  t.end();
});

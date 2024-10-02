import { createLogger } from '../src/index.ts'

const logger = createLogger()

logger.log('This is a Default [LOG] Message')
logger.warn('This is a Default [WARN] Message')
logger.debug('This is a Default [DEBUG] Message')
logger.error('This is a Default [ERROR] Message')
logger.info('This is a default [INFO] Message')
logger.export('./examples/logs/default')

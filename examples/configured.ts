import { addColor, createLogger } from '../src/index.ts'

const coloredLogger = createLogger({
  colors: {
    log: '#809BCE',
    warn: '#95B8D1',
    debug: '#B8E0D2',
    error: '#EAC4D5',
    info: '#D6EADF'
  }
})

coloredLogger.log('This is a Colored [LOG] Message')
coloredLogger.warn('This is a Colored [WARN] Message')
coloredLogger.debug('This is a Colored [DEBUG] Message')
coloredLogger.error('This is a Colored [ERROR] Message')
coloredLogger.info('This is a Colored [INFO] Message')
coloredLogger.export('./examples/logs/colored')

const timestampLogger = createLogger({
  timestamps: false
})

timestampLogger.log('This is a Timestamp Off [LOG] Message')
timestampLogger.warn('This is a Timestamp Off [WARN] Message')
timestampLogger.debug('This is a Timestamp Off [DEBUG] Message')
timestampLogger.error('This is a Timestamp Off [ERROR] Message')
timestampLogger.info('This is a Timestamp Off [INFO] Message')
timestampLogger.export('./examples/logs/timestamp-off')

const messageLogger = createLogger({
  messages: {
    log: ({ timestamp, level, message, color }) => {
      const coloredLevel = addColor(color, `[${level.toUpperCase()}]`)

      return `This is a Custom Message ${coloredLevel} ${message} @ ${timestamp}`
    },
    error: ({ timestamp, level, message }) => {
      const coloredMessage = addColor('#E74C3C', message)
      const formattedDate = new Date(timestamp)

      return `[${level.toUpperCase()}] ${coloredMessage} - ${formattedDate.getFullYear()}`
    }
  }
})

messageLogger.log('This a Custom [LOG] Function')
messageLogger.error('Custom Color [ERROR]')
messageLogger.export('./examples/logs/custom-message')

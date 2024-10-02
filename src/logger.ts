import fs from 'node:fs'
import path from 'node:path'

import { colorize, getTimestamp } from './utils/index.ts'

type LogLevel = 'log' | 'warn' | 'debug' | 'error' | 'info'
type LogFileType = 'csv' | 'json' | 'txt'
type MessageFunction = (options: MessageOptions) => void

interface MessageOptions {
  timestamp: string
  level: LogLevel
  message: string
  color: string
}

interface LoggerOptions {
  colors?: { [key in LogLevel]: string }
  timestamps?: boolean
  messages?: Partial<{ [key in LogLevel]: MessageFunction }>
}

interface ExportOptions {
  levels?: LogLevel[]
  format?: LogFileType
  jsonSpaces?: number
  csvSeparator?: string
  includeTimestamp?: boolean
  includeLevel?: boolean
}

class Logger {
  private logs: string[] = []

  private colors: { [key in LogLevel]: string }
  private timestamps: boolean = true
  private messages: { [key in LogLevel]: MessageFunction }

  constructor(options?: LoggerOptions) {
    this.colors = options?.colors || {
      log: '#00ff00', // Green
      warn: '#ffff00', // Yellow
      debug: '#0000ff', // Blue
      error: '#ff0000', // Red
      info: '#00ffff' // Cyan
    }
    this.timestamps = options?.timestamps ?? true
    this.messages = {
      log: this.createMessage,
      warn: this.createMessage,
      debug: this.createMessage,
      error: this.createMessage,
      info: this.createMessage,
      ...options?.messages
    }
  }

  private createMessage(options: MessageOptions): string {
    const { timestamp, level, message, color } = options
    const coloredLevel = colorize(color, `[${level.toUpperCase()}]`)

    return `${timestamp.length > 0 ? `[${timestamp}]` : ``}${coloredLevel} ${message}`
  }

  private display(level: LogLevel, message: string): void {
    const finalMessage = this.messages[level]({
      timestamp: this.timestamps ? `${getTimestamp()}` : '',
      level,
      message,
      color: this.colors[level]
    })

    console[level](finalMessage)

    const logEntry = `[${getTimestamp()}] [${level.toUpperCase()}] ${message}`
    this.logs.push(logEntry)
  }

  log(message: string): void {
    this.display('log', message)
  }

  warn(message: string): void {
    this.display('warn', message)
  }

  debug(message: string): void {
    this.display('debug', message)
  }

  error(message: string): void {
    this.display('error', message)
  }

  info(message: string): void {
    this.display('info', message)
  }

  export(filePath: string, options: ExportOptions = {}): void {
    const {
      levels,
      format = 'txt',
      jsonSpaces = 2,
      csvSeparator = ',',
      includeTimestamp = true,
      includeLevel = true
    } = options

    const dir = path.dirname(filePath)

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    let filteredLogs = this.logs
    if (levels && levels.length > 0) {
      filteredLogs = this.logs.filter(log => {
        const logLevel = log
          .match(/\[([A-Z]+)\]/)?.[1]
          .toLowerCase() as LogLevel
        return levels.includes(logLevel)
      })
    }

    let content: string

    switch (format) {
      case 'json': {
        const jsonLogs = filteredLogs.map(log => {
          const [timestamp, level, ...messageParts] = log.split('] ')
          const message = messageParts.join('] ').trim()
          return {
            ...(includeTimestamp && { timestamp: timestamp.slice(1) }),
            ...(includeLevel && { level: level.slice(1).toLowerCase() }),
            message
          }
        })
        content = JSON.stringify(jsonLogs, null, jsonSpaces)
        break
      }
      case 'csv': {
        const headers = [
          ...(includeTimestamp ? ['Timestamp'] : []),
          ...(includeLevel ? ['Level'] : []),
          'Message'
        ]
        const csvRows = filteredLogs.map(log => {
          const [timestamp, level, ...messageParts] = log.split('] ')
          const message = messageParts.join('] ').trim()
          return [
            ...(includeTimestamp ? [timestamp.slice(1)] : []),
            ...(includeLevel ? [level.slice(1)] : []),
            message
          ]
            .map(field => `"${field.replace(/"/g, '""')}"`)
            .join(csvSeparator)
        })
        content = [headers.join(csvSeparator), ...csvRows].join('\n')
        break
      }
      case 'txt':
      default: {
        content = filteredLogs.join('\n')
        break
      }
    }

    fs.writeFileSync(filePath, content)
    console.log(`Logs exported to ${filePath}`)
  }
}

const init = (options?: LoggerOptions): Logger => {
  return new Logger({ ...options, timestamps: options?.timestamps ?? true })
}

export default init

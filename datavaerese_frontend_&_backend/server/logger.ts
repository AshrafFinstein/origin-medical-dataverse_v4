import winston, { Logger as WinstonLogger, createLogger, transports, format } from 'winston';
import { Writable } from 'stream';
const {combine, timestamp, label, printf, prettyPrint, splat, simple, colorize, cli} = winston.format
import DailyRotateFile from 'winston-daily-rotate-file';

class MyStream extends Writable {
  write(chunk: any) {
    return true;
  }
}

const colorFormat = cli({
  colors: {
    info: 'blue',
    error: 'red',
    warn: 'yellow',
    debug: 'green'
  }
})

const options = {
  success: {
    level: 'debug',
    filename: 'log_success.log',
    dirname: 'logs', // Directory where logs should be stored
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxFiles: '14d',
    prepend: true, // Prepends the timestamp to the log file name
    extension: '', // No extension to keep the main log file name as 'log_success.log'
    createSymlink: true,
    symlinkName: 'log_success.log',
    colorize: false,
    handleExceptions: true,
    json: true
  },
  error: {
    level: 'e',
    filename: 'log_error.log',
    dirname: 'logs', // Directory where logs should be stored
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxFiles: '14d',
    prepend: true, // Prepends the timestamp to the log file name
    extension: '', // No extension to keep the main log file name as 'log_success.log'
    createSymlink: true,
    symlinkName: 'log_error.log',
    colorize: false,
    handleExceptions: true,
    json: true
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: true,
    colorize: true
  }
}

const successLog = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: customUtcTimestamp }),
    format.json()
  ),
  transports: [
    new DailyRotateFile(options.success),
    new winston.transports.Console({
      format: format.combine(
        format.colorize(),
        format.splat()
      )
    })
  ],
});

const errorLog = createLogger({
  level: 'error',
  format: format.json(),
  transports: [
    new DailyRotateFile(options.error),
    new winston.transports.Console({
      format: format.combine(
        format.colorize(),
        format.splat()
      )
    })
  ],
});

function customUtcTimestamp() {
  const now = new Date();
  const isoString = now.toISOString(); // Get the ISO 8601 format

  // Extract the desired UTC format parts (YYYY-MM-DDTHH:mm:ss.SSSZ)
  const utcFormat = isoString.slice(0, 23) + 'Z';

  return utcFormat;
}

const errorLogStream = new MyStream();
const successLogStream = new MyStream();

// Add your custom streams to the logger instances
errorLog.add(new transports.Stream({ stream: errorLogStream }));
successLog.add(new transports.Stream({ stream: successLogStream }));

// Export your logger instances
export { errorLog, successLog };
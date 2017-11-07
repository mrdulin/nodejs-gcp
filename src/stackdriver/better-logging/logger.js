const winston = require('winston');
const { LoggingWinston } = require('@google-cloud/logging-winston');
const { format } = require('winston');
const pkg = require('./package.json');

console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);

function jsonFormat(obj) {
  return JSON.stringify(obj, null, 2);
}

let transports = [];
let level = 'debug';
if (process.env.NODE_ENV === 'production') {
  const loggingWinston = new LoggingWinston({
    serviceContext: {
      service: pkg.name,
      version: pkg.version
    }
  });
  transports = [new winston.transports.Console(), loggingWinston];
  level = 'error';
} else {
  const printf = format.printf((info) => {
    const { level, ...rest } = info;
    let log;
    if (rest.stack) {
      const { stack, ...others } = rest;
      log =
        `[${info.timestamp}][${info.level}]: ${jsonFormat(others)}\n\n` +
        `[${info.timestamp}][${info.level}]: ${stack}\n\n`;
    } else {
      log = `[${info.timestamp}][${info.level}]: ${jsonFormat(rest)}\n\n`;
    }
    return log;
  });
  transports = [
    new winston.transports.Console({
      format: format.combine(format.colorize(), format.timestamp(), format.errors({ stack: true }), printf)
    })
  ];
}

const logger = winston.createLogger({
  level,
  defaultMeta: { service: pkg.name },
  transports
});

module.exports = { logger };

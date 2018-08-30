import { createLogger, transports, format, Logger } from 'winston';

function createAppLogger(): Logger {
  const { combine, timestamp, printf, colorize } = format;

  return createLogger({
    format: combine(
      colorize(),
      timestamp(),
      printf(
        (info: any): string => {
          const label: string = info.label ? ' ' + info.label + ' ' : '';
          return `${info.timestamp}${label}[${info.level}] : ${JSON.stringify(info.message)}`;
        }
      )
    ),
    transports: [new transports.Console()]
  });
}

const logger: Logger = createAppLogger();

export { logger };

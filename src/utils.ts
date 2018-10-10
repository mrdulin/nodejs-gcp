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

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function coin(): boolean {
  return Math.random() > 0.5;
}

export { logger, sleep, coin };

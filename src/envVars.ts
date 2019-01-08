import dotenv from 'dotenv';
import path from 'path';
import { logger } from './utils';

logger.info(path.resolve(__dirname, '../.env'));
logger.info(`process.env.DEBUG: ${process.env.DEBUG}`);
dotenv.config({ path: path.resolve(__dirname, '../.env'), debug: !!process.env.DEBUG });

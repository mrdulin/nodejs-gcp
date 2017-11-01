import dotenv from 'dotenv';
import path from 'path';
import { logger } from './utils';

dotenv.config({ path: path.resolve(__dirname, '../.env'), debug: !!process.env.DEBUG });

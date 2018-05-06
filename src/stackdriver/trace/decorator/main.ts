import { createServer } from './server';
import { logger } from '../../../utils';

async function main() {
  await createServer();
}

main();

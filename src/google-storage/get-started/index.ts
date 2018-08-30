import * as Storage from '@google-cloud/storage';

import { logger } from '../../utils';

const storage: Storage = new Storage();

function main() {
  storage
    .getBuckets()
    .then(results => {
      const buckets = results[0];
      logger.info('Buckets:');
      buckets.forEach(bucket => {
        logger.info(bucket.name);
      });
    })
    .catch(err => {
      logger.error(err);
    });
}

main();

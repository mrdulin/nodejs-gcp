import { getBuckets, listAllObjects } from '../../gcs';
import { logger } from '../../utils';
import { config } from './config';

describe('bucket test suites', () => {
  it('should list buckets', async () => {
    const buckets = await getBuckets();
    const bucketNames: string[] = [];
    buckets.forEach((bucket) => {
      bucketNames.push(bucket.name);
    });
    logger.debug('bucketNames', { extra: bucketNames });
  });

  it('should list all objects', async () => {
    const files = await listAllObjects(config.bucket);
    const filenames: string[] = files.map((file) => file.name);
    logger.debug('filenames', { extra: filenames });
  });
});

import { listAllObjects } from '../../gcs';
import { logger } from '../../utils';

async function main() {
  const bucketName = 'ez2on';
  const files = await listAllObjects(bucketName);
  if (files) {
    files.forEach((file) => {
      logger.info(file.name);
    });
  }
}

main();

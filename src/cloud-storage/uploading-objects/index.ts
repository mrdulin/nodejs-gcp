import path from 'path';

import { createBucket, upload } from '../../gcs';

async function main() {
  const bucketName = 'nodejs-gcp';
  await createBucket(bucketName, { regional: true, location: 'asia-east1' });

  const filename = path.resolve(__dirname, './mmczblsq.doc');
  await upload(bucketName, filename, {
    gzip: true,
    metadata: {
      cacheControl: 'public, max-age=31536000'
    }
  });
}

main();

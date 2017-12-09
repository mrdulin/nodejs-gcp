import { createBucket, getBuckets, deleteBucket } from '../../gcs';
import { logger } from '../../utils';

async function main() {
  console.log('PROJECT_ID: ', process.env.PROJECT_ID);
  await getBuckets();
  const bucketName = 'nodejs-gcp';
  // await createBucket(bucketName, {
  //   regional: true,
  //   location: 'asia-east1'
  // });

  // await deleteBucket(bucketName);
}

main();

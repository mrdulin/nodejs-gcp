import { createBucket, getBuckets, deleteBucket } from '../../gcs';

async function main() {
  await getBuckets();
  const bucketName = 'nodejs-gcp';
  await createBucket(bucketName, {
    regional: true,
    location: 'asia-east1'
  });

  await deleteBucket(bucketName);
}

main();

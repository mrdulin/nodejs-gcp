import dotenv from 'dotenv';
import { Storage, File, Bucket, GetSignedUrlConfig, GetSignedUrlResponse } from '@google-cloud/storage';
import { logger } from '../../utils';

dotenv.config();

/**
 * Generate a URL that allows temporary access to download your file.
 *
 * @author dulin
 */
function main() {
  const bucketName = process.env.BUCKET;
  if (!bucketName) {
    throw new Error('bucket name is required');
  }

  const storage: Storage = new Storage({ keyFilename: process.env.KEY_FILE_PATH });
  const bucket: Bucket = storage.bucket(bucketName);

  const file: File = bucket.file('google-cloud-stackdriver-trace-integrate-graphql.png');
  const conf: GetSignedUrlConfig = {
    action: 'read',
    // expire after 10 seconds from now
    expires: Date.now() + 60 * 1000
  };
  file
    .getSignedUrl(conf)
    .then((resp: GetSignedUrlResponse) => {
      const signedUrl = resp[0];
      logger.debug(`signed url: ${signedUrl}`);
    })
    .catch((err) => {
      logger.error(err);
    });
}

main();

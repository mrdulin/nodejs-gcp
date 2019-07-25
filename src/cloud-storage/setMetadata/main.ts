import dotenv from 'dotenv';
import { Storage, File, Bucket, GetSignedUrlResponse, UploadResponse } from '@google-cloud/storage';
import { logger } from '../../utils';
import faker from 'faker';
import path from 'path';

dotenv.config();

type GetSignedUrlAction = 'read' | 'write' | 'delete' | 'resumable';

async function main() {
  const bucketName = process.env.BUCKET;
  if (!bucketName) {
    throw new Error('bucket name is required');
  }

  const storage: Storage = new Storage({ keyFilename: process.env.KEY_FILE_PATH });
  const bucket: Bucket = storage.bucket(bucketName);

  // const writeSignedUrl = await getSignedUrl(file, 'write');
  const objectName = '1547012340909WX20190108-124331.png';
  const filePath = path.resolve(__dirname, `../../../tmp/${objectName}`);

  const uploadResponse: UploadResponse = await bucket.upload(filePath, {
    gzip: true,
    metadata: {
      cacheControl: 'public,max-age=1800'
    }
  });
  const [_, metadata] = uploadResponse;
  logger.debug('metadata', { arguments: { metadata } });

  // const setMetadataResponse = await file.setMetadata({
  //   metadata: {
  //     uid: faker.random.uuid()
  //   },
  //   cacheControl: 'max-age=60'
  // });
  // const metadata = setMetadataResponse[0];
  // logger.debug('metadata', { arguments: { metadata } });
  const file: File = bucket.file(objectName);
  const readSignedUrl = await getSignedUrl(file, 'read');
  logger.debug('signedUrl', { arguments: { readSignedUrl } });
}

async function getSignedUrl(file: File, action: GetSignedUrlAction) {
  const getSignedUrlResponse: GetSignedUrlResponse = await file.getSignedUrl({
    action,
    expires: Date.now() + 60 * 60 * 1000,
    version: 'v4'
  });
  const signedUrl: string = getSignedUrlResponse[0];
  return signedUrl;
}

main();

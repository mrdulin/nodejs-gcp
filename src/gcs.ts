import Storage, { UploadOptions, DownloadOptions } from '@google-cloud/storage';
import path from 'path';

import { logger } from './utils';

const storage: Storage = new Storage({
  keyFilename: path.resolve(__dirname, '../.gcp/nodejs-starter-6e41cd4497ca.json')
});

function getBuckets() {
  return storage
    .getBuckets()
    .then((results) => {
      logger.info('Get buckets success.');
      const buckets = results[0];
      const bucketNames: string[] = [];
      buckets.forEach((bucket) => {
        bucketNames.push(bucket.name);
      });
      logger.info(`bucketNames: ${JSON.stringify(bucketNames)}`);
      return buckets;
    })
    .catch((err) => {
      logger.error(err);
    });
}

async function exists(bucketName: string) {
  let result: boolean = false;
  try {
    const bucket = storage.bucket(bucketName);
    const data = await bucket.exists();
    result = data[0];
  } catch (error) {
    logger.error(`Check bucket ${bucketName} exists failed. ${error}`);
  }
  return result;
}

async function createBucket(bucketName: string, config: Storage.BucketConfig) {
  if (await exists(bucketName)) {
    return;
  }
  return storage
    .createBucket(bucketName, config)
    .then(() => {
      logger.info(`Bucket ${bucketName} created.`);
    })
    .catch((err) => {
      logger.error(`Created bucket ${bucketName} failed. ${err}`);
    });
}

async function deleteBucket(bucketName: string) {
  try {
    await storage.bucket(bucketName).delete();
    logger.info(`Bucket ${bucketName} deleted.`);
  } catch (error) {
    logger.error(`Bucket ${bucketName} deleted failed. ${error}`);
  }
}

function upload(bucketName: string, filename: string, options?: UploadOptions) {
  return storage
    .bucket(bucketName)
    .upload(filename, options)
    .then(() => {
      logger.info(`${filename} uploaded to ${bucketName}.`);
    })
    .catch((err) => {
      logger.info(`${filename} uploaded to ${bucketName} failed. ${err}`);
    });
}

function listAllObjects(bucketName: string) {
  return storage
    .bucket(bucketName)
    .getFiles()
    .then((result) => {
      const [files] = result;
      return files;
    })
    .catch((err) => {
      logger.info(`Get files from ${bucketName} failed. ${err}`);
    });
}

function download(bucketName: string, srcFilename: string, options?: DownloadOptions) {
  return storage
    .bucket(bucketName)
    .file(srcFilename)
    .download(options)
    .then(() => {
      let destination = '';
      let msg: string = `gs://${bucketName}/${srcFilename} downloaded`;
      if (options && options.destination) {
        destination = options.destination;
        msg = `${msg} to ${destination}.`;
      }
      logger.info(msg);
    });
}

export { getBuckets, createBucket, deleteBucket, upload, listAllObjects, download };

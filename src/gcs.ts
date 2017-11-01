import {
  Storage,
  UploadOptions,
  DownloadOptions,
  UploadResponse,
  GetBucketsResponse,
  Bucket,
  File,
  DownloadResponse
} from '@google-cloud/storage';
import path from 'path';
import { logger } from './utils';

const storage: Storage = new Storage({
  projectId: process.env.PROJECT_ID,
  keyFilename: path.resolve(__dirname, '../.gcp/cloud-storage-admin.json')
});

async function getBuckets(): Promise<Bucket[]> {
  try {
    const response: GetBucketsResponse = await storage.getBuckets();
    const buckets: Bucket[] = response[0];
    return buckets;
  } catch (err) {
    logger.error(err);
    throw new Error('get buckets error');
  }
}

async function exists(bucketName: string) {
  try {
    const bucket: Bucket = storage.bucket(bucketName);
    const [rval] = await bucket.exists();
    return rval;
  } catch (error) {
    logger.error(error);
    throw new Error(`check budget exists error`);
  }
}

async function createBucket(bucketName: string, config) {
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

async function upload(bucketName: string, file: string, options?: UploadOptions): Promise<File> {
  try {
    const response: UploadResponse = await storage.bucket(bucketName).upload(file, options);
    const [uploadedFile] = response;
    return uploadedFile;
  } catch (err) {
    logger.error(err);
    throw new Error(`${file} uploaded to ${bucketName} error`);
  }
}

async function listAllObjects(bucketName: string) {
  try {
    const response = await storage.bucket(bucketName).getFiles();
    const [files] = response;
    return files;
  } catch (err) {
    logger.error(err);
    throw new Error('list all objects error');
  }
}

async function download(bucketName: string, filename: string, options?: DownloadOptions) {
  try {
    const response: DownloadResponse = await storage
      .bucket(bucketName)
      .file(filename)
      .download(options);
    const [buffer]: [Buffer] = response;
    return buffer;
  } catch (error) {
    throw error;
  }
}

export { getBuckets, createBucket, deleteBucket, upload, listAllObjects, download, storage };

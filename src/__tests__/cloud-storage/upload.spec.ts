import { UploadOptions, Storage, Bucket, GetSignedUrlConfig, GetSignedUrlResponse } from '@google-cloud/storage';
import path from 'path';
import { upload, storage } from '../../gcs';
import { config } from './config';
import { generateEncryptionKey, logger } from '../../utils';
import faker from 'faker';
import fs from 'fs';

describe('#upload', () => {
  const keyFilename = path.resolve(__dirname, '../../../.gcp/cloud-storage-admin.json');
  // const fileName = 'mmczblsq.doc';
  const fileName = '1547012340909WX20190108-124331.png';
  const filePath = path.resolve(__dirname, `../../../tmp/${fileName}`);

  it.skip('should upload file correctly', async () => {
    await upload(config.bucket, filePath, {
      gzip: true,
      metadata: {
        cacheControl: 'public, max-age=31536000'
      }
    });
  });

  // https://nodejs.org/api/stream.html#stream_writable_end_chunk_encoding_callback
  it.skip('should upload file correctly with buffer content', async () => {
    const myStorage = new Storage({ keyFilename });
    const bucket: Bucket = myStorage.bucket('ez2on');
    const file = bucket.file(Date.now() + fileName);
    const fileContent = fs.readFileSync(filePath);
    await file.save(fileContent, { resumable: false });
    await file.makePublic();
    logger.debug('file upload success');
  });

  it.skip('should make file privatly and get signed url correctly', async () => {
    const myStorage = new Storage({ keyFilename });
    const bucket: Bucket = myStorage.bucket('ez2on');
    const file = bucket.file(fileName);
    await file.makePrivate();
    const conf: GetSignedUrlConfig = {
      action: 'read',
      expires: Date.now() + 30 * 1000
    };
    const resp: GetSignedUrlResponse = await file.getSignedUrl(conf);
    const signedUrl: string = resp[0];
    logger.debug(`signed url: ${signedUrl}`);
    expect(typeof signedUrl).toBe('string');
  });

  it.skip('should upload file and create a folder correctly', async () => {
    const myStorage = new Storage({ keyFilename });
    const bucket = myStorage.bucket('ez2on');
    const uuid = faker.random.uuid();

    await bucket.upload(filePath, {
      destination: `${uuid}/${fileName}`,
      gzip: true,
      metadata: {
        cacheControl: 'public, max-age=31536000'
      }
    });
  });

  it.skip('should upload file with encryption key correctly', async () => {
    const encryptionKey = generateEncryptionKey();
    logger.debug(`encryptionKey: ${encryptionKey}`);
    const options: UploadOptions = {
      destination: 'mmczblsq.encrypted.doc',
      encryptionKey: Buffer.from(encryptionKey, 'base64')
    };
    const uploadedFile = await upload(config.bucket, filePath, options);
    logger.debug('uploaded file name', { extra: uploadedFile.name });
  });

  // Error: Permission denied on Cloud KMS key. Please ensure that your Cloud Storage service account  has been authorized to use this key.
  // solve: gsutil kms authorize -p <PROJECT_ID> -k projects/${PROJECT_ID}/locations/global/keyRings/test/cryptoKeys/nodejs-gcp
  it.skip('should upload file with kms key correctly', async () => {
    logger.debug(`process.env.PROJECT_ID: ${process.env.PROJECT_ID}`);
    await storage.bucket(config.bucket).upload(filePath, {
      kmsKeyName: `projects/${process.env.PROJECT_ID}/locations/global/keyRings/test/cryptoKeys/nodejs-gcp`,
      destination: 'mmczblsq.kms.encrypted.doc'
    });
  });

  it.skip('should upload and encrypt secret json file with kms key correctly', async () => {
    const secretJSONFile = path.resolve(__dirname, '../../../tmp/secrets.json');
    await storage.bucket(config.bucket).upload(secretJSONFile, {
      kmsKeyName: `projects/${process.env.PROJECT_ID}/locations/global/keyRings/test/cryptoKeys/nodejs-gcp`,
      destination: 'secret.json.encrypted'
    });
  });
});

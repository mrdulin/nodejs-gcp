import { UploadOptions, Storage } from '@google-cloud/storage';
import path from 'path';
import { upload, storage } from '../../gcs';
import { config } from './config';
import { generateEncryptionKey, logger } from '../../utils';
import faker from 'faker';

describe('#upload', () => {
  const file = path.resolve(__dirname, '../../../tmp/mmczblsq.doc');

  it.skip('should upload file correctly', async () => {
    await upload(config.bucket, file, {
      gzip: true,
      metadata: {
        cacheControl: 'public, max-age=31536000'
      }
    });
  });

  it('should upload file and create a folder correctly', async () => {
    const myStorage = new Storage({ keyFilename: path.resolve(__dirname, '../../../.gcp/cloud-storage-admin.json') });
    const bucket = myStorage.bucket('ez2on');
    const fileName = 'mmczblsq.doc';
    const filePath = path.resolve(__dirname, `../../../tmp/${fileName}`);
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
    const uploadedFile = await upload(config.bucket, file, options);
    logger.debug('uploaded file name', { extra: uploadedFile.name });
  });

  // Error: Permission denied on Cloud KMS key. Please ensure that your Cloud Storage service account  has been authorized to use this key.
  // solve: gsutil kms authorize -p <PROJECT_ID> -k projects/${PROJECT_ID}/locations/global/keyRings/test/cryptoKeys/nodejs-gcp
  it.skip('should upload file with kms key correctly', async () => {
    logger.debug(`process.env.PROJECT_ID: ${process.env.PROJECT_ID}`);
    await storage.bucket(config.bucket).upload(file, {
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

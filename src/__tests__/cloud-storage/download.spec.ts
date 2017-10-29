import path from 'path';
import { download, storage } from '../../gcs';
import { DownloadOptions, Storage, DownloadResponse } from '@google-cloud/storage';
import { config } from './config';
import { logger } from '../../utils';

function getDestination(filename: string) {
  return path.resolve(__dirname, `../../../tmp/${filename}`);
}

describe('#download', () => {
  it.skip('simple download', async () => {
    const bucketName = 'shadowsocks-218808.appspot.com';
    const srcFilename = '1547012340909WX20190108-124331.png';
    await download(bucketName, srcFilename, { destination: getDestination(srcFilename) });
  });

  it.skip('will throw error when download encrypted file without encryption key', async () => {
    const srcFilename = 'mmczblsq.encrypted.doc';
    const options: DownloadOptions = { destination: getDestination('mmczblsq-without-encryption-key.doc') };
    await expect(download(config.bucket, srcFilename, options)).rejects.toEqual(
      new Error('The target object is encrypted by a customer-supplied encryption key.')
    );
  });

  it.skip('should download encrypted file with encryption key correctly', async () => {
    const srcFilename = 'mmczblsq.encrypted.doc';
    const options: DownloadOptions = { destination: getDestination('mmczblsq-with-encryption-key.doc') };
    const key = 'KER+DGPmAG5/HLC1Yhflfx9W5p/bdgzc+N9M2HynmsM=';
    await storage
      .bucket(config.bucket)
      .file(srcFilename)
      .setEncryptionKey(Buffer.from(key, 'base64'))
      .download(options);
  });

  it.skip('will throw error when download kms encrypted file with no permission service account', async () => {
    const srcFilename = 'mmczblsq.kms.encrypted.doc';
    const options: DownloadOptions = { destination: getDestination('mmczblsq-with-no-permission-service-account.doc') };
    const newStorage = new Storage({ keyFilename: path.resolve(__dirname, '../../../.gcp/pubsub-admin.json') });
    await expect(
      newStorage
        .bucket(config.bucket)
        .file(srcFilename)
        .download(options)
    ).rejects.toThrow(/iam.gserviceaccount.com does not have storage.objects.get access/);
  });

  it.skip('should download and decrypt kms encrypted file with service account with the correct permission', async () => {
    const srcFilename = 'mmczblsq.kms.encrypted.doc';
    const options: DownloadOptions = { destination: getDestination('mmczblsq-with-kms-encryption-key.doc') };
    await storage
      .bucket(config.bucket)
      .file(srcFilename)
      .download(options);
  });

  it.skip('should download and decrypt kms encrypted file into memory with the serivce account with the correct permission', async () => {
    const srcFilename = 'mmczblsq.kms.encrypted.doc';
    const response: DownloadResponse = await storage
      .bucket(config.bucket)
      .file(srcFilename)
      .download();
    const contents = response[0];
    logger.debug('contents', { extra: contents.toString() });
  });

  it.skip('should download and decrypt kms encrypted secret json file into memory correctly', async () => {
    const srcFilename = 'secret.json.encrypted';
    const response: DownloadResponse = await storage
      .bucket(config.bucket)
      .file(srcFilename)
      .download();
    const contents = response[0];
    const secrets = JSON.parse(contents.toString());
    logger.debug('contents', { extra: { secrets } });
  });

  it('will throw error when download kms encrypted file with no permission service account', async () => {
    const srcFilename = 'secret.json.encrypted';
    const options: DownloadOptions = { destination: getDestination('secret-with-no-permission-service-account.json') };
    const newStorage = new Storage({ keyFilename: path.resolve(__dirname, '../../../.gcp/pubsub-admin.json') });
    await expect(
      newStorage
        .bucket(config.bucket)
        .file(srcFilename)
        .download(options)
    ).rejects.toThrow(/iam.gserviceaccount.com does not have storage.objects.get access/);
  });
});

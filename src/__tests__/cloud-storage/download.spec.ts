import path from 'path';
import { download, storage } from '../../gcs';
import { DownloadOptions } from '@google-cloud/storage';
import { config } from './config';

function getDestination(filename: string) {
  return path.resolve(__dirname, `../../../tmp/${filename}`);
}

describe('#download', () => {
  it.skip('simple download', async () => {
    const bucketName = 'shadowsocks-218808.appspot.com';
    const srcFilename = '1547012340909WX20190108-124331.png';
    await download(bucketName, srcFilename, { destination: getDestination(srcFilename) });
  });

  it.skip('download encrypted file without encryption key', async () => {
    const srcFilename = 'mmczblsq.encrypted.doc';
    const options: DownloadOptions = { destination: getDestination('mmczblsq-without-encryption-key.doc') };
    await expect(download(config.bucket, srcFilename, options)).rejects.toEqual(
      new Error('The target object is encrypted by a customer-supplied encryption key.')
    );
  });

  it('should download encrypted file with encryption key correctly', async () => {
    const srcFilename = 'mmczblsq.encrypted.doc';
    const options: DownloadOptions = { destination: getDestination('mmczblsq-with-encryption-key.doc') };
    const key = 'KER+DGPmAG5/HLC1Yhflfx9W5p/bdgzc+N9M2HynmsM=';
    await storage
      .bucket(config.bucket)
      .file(srcFilename)
      .setEncryptionKey(Buffer.from(key, 'base64'))
      .download(options);
  });
});

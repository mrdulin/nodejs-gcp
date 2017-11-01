import { UploadOptions } from '@google-cloud/storage';
import path from 'path';
import { upload } from '../../gcs';
import { config } from './config';
import { generateEncryptionKey, logger } from '../../utils';

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

  it('should upload file with encryption key correctly', async () => {
    const encryptionKey = generateEncryptionKey();
    logger.debug(`encryptionKey: ${encryptionKey}`);
    const options: UploadOptions = {
      destination: 'mmczblsq.encrypted.doc',
      encryptionKey: Buffer.from(encryptionKey, 'base64')
    };
    const uploadedFile = await upload(config.bucket, file, options);
    logger.debug('uploaded file name', { extra: uploadedFile.name });
  });
});

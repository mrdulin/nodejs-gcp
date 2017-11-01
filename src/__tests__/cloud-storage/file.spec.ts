import { storage } from '../../gcs';
import { config } from './config';

describe('file test suites', () => {
  it('#delete', async () => {
    const bucket = storage.bucket(config.bucket);
    const file = bucket.file('mmczblsq.encrypted.doc');
    await file.delete();
  });
});

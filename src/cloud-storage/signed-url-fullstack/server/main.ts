import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import { Storage, File, Bucket, GetSignedUrlResponse } from '@google-cloud/storage';
import path from 'path';
import { logger } from '../../../utils';

dotenv.config();

function main() {
  const app: Application = express();
  const port: number = 3000;

  app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, '../client/index.html'));
  });

  app.get('/signed-url', async (req: Request, res: Response) => {
    const bucketName: string | undefined = process.env.BUCKET;
    if (!bucketName) {
      logger.error('Require bucket name');
      res.sendStatus(500);
      return;
    }
    const filename: string = req.query.filename;
    if (!filename) {
      logger.error('Require filename');
      res.sendStatus(400);
      return;
    }
    console.log('filename: ', filename);
    const storage: Storage = new Storage({ keyFilename: process.env.KEY_FILE_PATH });
    const bucket: Bucket = storage.bucket(bucketName);
    const file: File = bucket.file(filename);

    try {
      const getSignedUrlResponse: GetSignedUrlResponse = await file.getSignedUrl({
        action: 'write',
        expires: Date.now() + 60 * 1000,
        version: 'v4'
      });
      const signedUrl: string = getSignedUrlResponse[0];
      res.json({ signedUrl });
    } catch (error) {
      logger.error('get signed url error', { arguments: { error } });
      res.sendStatus(500);
    }
  });

  app.listen(port, () => {
    logger.debug(`HTTP server is listening on http://localhost:${port}`);
  });
}

main();

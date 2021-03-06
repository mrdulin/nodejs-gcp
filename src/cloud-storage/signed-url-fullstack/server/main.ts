import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import { Storage, File, Bucket, GetSignedUrlResponse } from '@google-cloud/storage';
import path from 'path';
import { logger } from '../../../utils';
import faker from 'faker';

dotenv.config();

const mockUserId = faker.random.uuid();
const mockCampaignId = faker.random.uuid();
const tmpDir = '/tmp';

function main() {
  const app: Application = express();
  const port: number = 3000;
  const storage: Storage = new Storage({ keyFilename: process.env.KEY_FILE_PATH });

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
    const action: 'read' | 'write' | 'delete' | 'resumable' = req.query.action;
    if (!filename) {
      logger.error('Require filename');
      res.sendStatus(400);
      return;
    }
    const allowActions = ['write', 'read', 'delete', 'resumable'];
    if (!allowActions.includes(action)) {
      logger.error(`action ${action} is not allowed`);
      res.sendStatus(400);
      return;
    }

    const bucket: Bucket = storage.bucket(bucketName);
    const objectName = `${tmpDir}/${mockUserId}/${mockCampaignId}/${filename}`;
    console.log('filename: ', filename);
    console.log('objectName: ', objectName);
    const file: File = bucket.file(objectName);

    try {
      const getSignedUrlResponse: GetSignedUrlResponse = await file.getSignedUrl({
        action,
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

  app.get('/:bucketName/:uid/:filename', async (req: Request, res: Response) => {
    const { bucketName, filename, uid } = req.params;
    const bucket: Bucket = storage.bucket('ez2on');
    const objectName =
      'b98dad5f-49df-4600-ac1b-c4f651fe2f9e/262bf2ec-2fab-4a3d-835a-87b621128ffa/graphql-n-plus-1-query.png';
    const file = bucket.file(objectName);
    const getSignedUrlResponse: GetSignedUrlResponse = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 60 * 1000,
      version: 'v4'
    });
    const signedUrl: string = getSignedUrlResponse[0];
    console.log('signedUrl: ', signedUrl);
    res.redirect(signedUrl);
  });

  app.listen(port, () => {
    logger.debug(`HTTP server is listening on http://localhost:${port}`);
  });
}

main();

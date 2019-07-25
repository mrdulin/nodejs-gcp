import express, { Request, Response } from 'express';
import { Application } from 'express-serve-static-core';
import pkg from '../package.json';

function createServer() {
  const app: Application = express();
  const port: number = 8080;
  app.get('/', (req: Request, res: Response) => {
    res.sendStatus(200);
  });
  app.get('/version', (req: Request, res: Response) => {
    res.send(`version: ${pkg.version}`);
  });
  return app.listen(port, () => {
    console.info(`HTTP server is listeninng on http://localhost:${port}`);
  });
}

export { createServer };

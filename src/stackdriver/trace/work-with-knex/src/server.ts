import express, { Request, Response } from 'express';
import { Application } from 'express-serve-static-core';
import { UserService } from './services';

function createServer() {
  const app: Application = express();
  const port: number = 8080;
  app.get('/', (req: Request, res: Response) => {
    res.sendStatus(200);
  });
  app.get('/users', async (req: Request, res: Response) => {
    const userService = new UserService();
    const users = await userService.findAll();
    res.json({ users });
  });
  return app.listen(port, () => {
    console.info(`HTTP server is listeninng on http://localhost:${port}`);
  });
}

export { createServer };

import express, { Request, Response } from 'express';
import { Application } from 'express-serve-static-core';
import { connection as knex } from './db';

function createServer() {
  const app: Application = express();
  const port: number = 8080;
  app.get('/', (req: Request, res: Response) => {
    res.sendStatus(200);
  });
  app.get('/users', async (req: Request, res: Response) => {
    const query = `select * from users;`;
    const users = await knex.raw(query).then((result) => result.rows);
    res.json({ users });
  });
  return app.listen(port, () => {
    console.info(`HTTP server is listeninng on http://localhost:${port}`);
  });
}

export { createServer };

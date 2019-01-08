import express from 'express';
import crypto from 'crypto';
import http from 'http';

import pkg from '../package.json';
import { insertVisit, getVisits } from './db';
import { printenv } from './util';

async function server(options): Promise<http.Server> {
  const app: express.Application = express();
  const { PORT, knex } = options;
  app.enable('trust proxy');

  app.get('/', (req, res) => {
    res.sendStatus(200);
  });

  app.get('/visits', (req, res, next) => {
    const visit = {
      timestamp: new Date(),
      userIp: crypto
        .createHash('sha256')
        .update(req.ip)
        .digest('hex')
        .substr(0, 7)
    };

    insertVisit(knex, visit)
      .then(() => getVisits(knex))
      .then((visits) => {
        res
          .status(200)
          .set('Content-Type', 'text/plain')
          .send(`Last 10 visits:\n${visits.join('\n')}`)
          .end();
      })
      .catch((err) => next(err));
  });

  app.get('/version', (req, res) => {
    res.send(`version: ${pkg.version}`);
  });

  app.get('/env', (req, res) => {
    const names: string[] = ['SQL_USER', 'SQL_DATABASE', 'INSTANCE_CONNECTION_NAME', 'NODE_ENV', 'PORT'];
    const envs = printenv(names);
    res.send(envs);
  });

  return app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

export { server };

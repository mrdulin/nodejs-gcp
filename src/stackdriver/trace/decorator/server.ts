import express from 'express';
import { DiscoveryService } from './DiscoveryService';
import { PersonService } from './PersonService';

async function createServer() {
  const app = express();
  const PORT = process.env.PORT || 3200;

  // This incoming HTTP request should be captured by Trace
  app.get('/', async (req, res) => {
    // This outgoing HTTP request should be captured by Trace
    try {
      const names = await DiscoveryService.getDiscovery();
      res
        .status(200)
        .send(names)
        .end();
      return;
    } catch (err) {
      res.sendStatus(500);
    }
  });

  app.get('/person', async (req, res) => {
    const personService = new PersonService();
    await personService.getByType();
    res.sendStatus(200);
  });

  return app.listen(PORT, () => {
    console.info(`App listening on port http://localhost:${PORT}`);
    console.info('Press Ctrl+C to quit.');
  });
}

export { createServer };

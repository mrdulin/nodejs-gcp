import express from 'express';
import { logger } from '../../../utils';
import { DiscoveryService } from './DiscoveryService';

async function createServer() {
  const app = express();

  // This incoming HTTP request should be captured by Trace
  app.get('/', async (req, res) => {
    // This outgoing HTTP request should be captured by Trace
    try {
      const names = await DiscoveryService.getDiscovery();
      res
        .status(200)
        .send(names)
        .end();
    } catch (err) {
      res.status(500).end();
    }
  });
  const PORT = process.env.PORT || 8080;

  return app.listen(PORT, () => {
    logger.info(`App listening on port http://localhost:${PORT}`);
    logger.info('Press Ctrl+C to quit.');
  });
}

export { createServer };

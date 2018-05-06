import express from 'express';
import rp from 'request-promise';

const DISCOVERY_URL = 'https://www.googleapis.com/discovery/v1/apis';

async function createServer() {
  const app = express();

  // This incoming HTTP request should be captured by Trace
  app.get('/', async (req, res) => {
    // This outgoing HTTP request should be captured by Trace
    try {
      const response = await rp.get(DISCOVERY_URL, { json: true });
      const names = response.items.map((item) => item.name);
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
    console.info(`App listening on port http://localhost:${PORT}`);
    console.info('Press Ctrl+C to quit.');
  });
}

export { createServer };

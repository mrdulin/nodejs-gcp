const serviceContext = {
  service: 'service 1'
};
const tracer = require('@google-cloud/trace-agent').start({
  keyFilename: '/Users/ldu020/workspace/github.com/mrdulin/nodejs-gcp/.gcp/stackdriver-trace-admin.json',
  serviceContext
});

const express = require('express');
const request = require('request-promise');

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  console.log('req.headers: ', JSON.stringify(req.headers, null, 2));
  const service2URL = 'http://localhost:3001';
  const service2Resp = await request.get(service2URL);
  console.log(`service2Resp: ${service2Resp}`);
  res.send(`service 1 ok. timestamp: ${Date.now()}.`);
});

app.listen(port, () => {
  console.log(`${serviceContext.service} server is listening on http://localhost:${port}`);
});

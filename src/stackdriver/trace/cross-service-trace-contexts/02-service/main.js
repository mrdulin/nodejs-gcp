const serviceContext = {
  service: 'service 2'
};
const tracer = require('@google-cloud/trace-agent').start({
  keyFilename: '/Users/ldu020/workspace/github.com/mrdulin/nodejs-gcp/.gcp/stackdriver-trace-admin.json',
  serviceContext
});

const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3001;

app.get('/', async (req, res) => {
  const span = tracer.createChildSpan({
    name: `${serviceContext.service} child span`,
    traceContext: req.headers['x-cloud-trace-context']
  });
  console.log('req.headers: ', JSON.stringify(req.headers, null, 2));
  const body = await fetch('https://api.itbook.store/1.0/search/mongodb').then((res) => res.json());
  span.endSpan();
  res.json(body);
});

app.listen(port, () => {
  console.log(`${serviceContext.service} server is listening on http://localhost:${port}`);
});

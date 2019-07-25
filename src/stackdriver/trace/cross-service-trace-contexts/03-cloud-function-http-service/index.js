const serviceContext = {
  service: 'service 3'
};
const tracer = require('@google-cloud/trace-agent').start({
  keyFilename: '/Users/ldu020/workspace/github.com/mrdulin/nodejs-gcp/.gcp/stackdriver-trace-admin.json',
  serviceContext
});

const express = require('express');

const app = express();
const port = 3002;

app.get('/', (req, res) => {
  const span = tracer.createChildSpan({
    name: `${serviceContext.service} child span`,
    traceContext: req.headers['x-cloud-trace-context']
  });
  console.log('req.headers: ', JSON.stringify(req.headers, null, 2));
  // "x-cloud-trace-context": "45ef98dbfa4342b0bd33580644752b4d/188499147648381;o=1"
  span.endSpan();
  res.send(`${serviceContext.service} is ok. timestamp: ${Date.now()}.`);
});

app.listen(port, () => {
  console.log(`${serviceContext.service} server is listening on http://localhost:${port}`);
});

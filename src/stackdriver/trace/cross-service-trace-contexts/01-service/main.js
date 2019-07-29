const pkg = require('./package.json');
const serviceContext = {
  service: pkg.name,
  version: pkg.version
};
const tracer = require('@google-cloud/trace-agent').start({
  keyFilename: '/Users/ldu020/workspace/github.com/mrdulin/nodejs-gcp/.gcp/stackdriver-trace-admin.json',
  serviceContext
});

const express = require('express');
const request = require('request-promise');
const { PubSub } = require('@google-cloud/pubsub');

const pubsub = new PubSub({
  keyFilename: '/Users/ldu020/workspace/github.com/mrdulin/nodejs-gcp/.gcp/pubsub-admin.json'
});
const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  // const responseTraceContext = tracer.getResponseTraceContext();
  // console.log('tracer.getResponseTraceContext: ', responseTraceContext);
  console.log('req.headers: ', JSON.stringify(req.headers, null, 2));

  const span = tracer.createChildSpan({ name: `publish message child span` });
  const traceContext = span.getTraceContext();
  span.addLabel('traceContext', traceContext);
  console.log('span.getTraceContext: ', traceContext);

  const message = { traceContext };
  const messageBuf = Buffer.from(JSON.stringify(message));
  try {
    await pubsub.topic('TestCloudTrace').publish(messageBuf);
  } catch (error) {
    console.error('publish message error');
    console.error(error);
  }
  span.endSpan();
  res.send(`${serviceContext.service} is ok. timestamp: ${Date.now()}.`);
});

app.listen(port, () => {
  console.log(`${serviceContext.service} server is listening on http://localhost:${port}`);
});

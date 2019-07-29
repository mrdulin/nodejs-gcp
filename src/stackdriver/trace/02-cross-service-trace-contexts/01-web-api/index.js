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
const { PubSub } = require('@google-cloud/pubsub');
const { createLogger } = require('dl-toolkits');

const pubsub = new PubSub({
  keyFilename: '/Users/ldu020/workspace/github.com/mrdulin/nodejs-gcp/.gcp/pubsub-admin.json'
});
const logger = createLogger();
const app = express();
const port = 3000;

function createCampaign() {
  return new Promise((resolve) => setTimeout(resolve, 2000));
}

app.post('/campaign', async (req, res) => {
  logger.debug('create campaign');
  const createCampaignSpan = tracer.createChildSpan({ name: 'create campaign' });
  await createCampaign();
  createCampaignSpan.endSpan();

  const span = tracer.createChildSpan({ name: `publish createCampaign message` });
  let traceContext = span.getTraceContext();
  traceContext = generateTraceContext(traceContext);
  span.addLabel('traceContext', traceContext);
  logger.debug(`span.getTraceContext: ${traceContext}`);

  const message = { traceContext };
  const messageBuf = Buffer.from(JSON.stringify(message));
  try {
    await pubsub.topic('createCampaign').publish(messageBuf);
  } catch (error) {
    logger.error('publish message error');
    logger.error(error);
  } finally {
    span.endSpan();
    res.sendStatus(200);
  }
});

function generateTraceContext(traceContext) {
  if (!traceContext) {
    return '';
  }
  let header = `${traceContext.traceId}/${traceContext.spanId}`;
  if (typeof traceContext.options !== 'undefined') {
    header += `;o=${traceContext.options}`;
  }
  return header;
}

app.listen(port, () => {
  logger.info(`${serviceContext.service} server is listening on http://localhost:${port}`);
});
